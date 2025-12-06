import { useRef, useState, useEffect, useCallback } from 'react';
import { enableMobileAudio, disableMobileAudio } from '../utils/mobileAudio';

export function useBinauralBeat() {
    const audioContextRef = useRef(null);
    const leftOscRef = useRef(null);
    const rightOscRef = useRef(null);
    const bothEarsOscRef = useRef(null);
    const noiseNodeRef = useRef(null);
    const leftGainRef = useRef(null);
    const rightGainRef = useRef(null);
    const bothEarsGainRef = useRef(null);
    const noiseGainRef = useRef(null);
    const noiseFilterRef = useRef(null);
    const masterGainRef = useRef(null);
    const layersRef = useRef([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentFrequencies, setCurrentFrequencies] = useState({ left: 0, right: 0, bothEars: 0, noiseType: null });
    // Microphone Refs
    const micStreamRef = useRef(null);
    const micSourceRef = useRef(null);
    const micGainRef = useRef(null);
    const soundscapeGainRef = useRef(null); // Reference for soundscape volume control
    const [isMicActive, setIsMicActive] = useState(false);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            // Master Gain
            masterGainRef.current = audioContextRef.current.createGain();
            masterGainRef.current.gain.value = volume;
            masterGainRef.current.connect(audioContextRef.current.destination);

            // Left Channel
            const leftPanner = audioContextRef.current.createStereoPanner();
            leftPanner.pan.value = -1; // Hard Left
            leftPanner.connect(masterGainRef.current);

            leftGainRef.current = audioContextRef.current.createGain();
            leftGainRef.current.connect(leftPanner);

            // Right Channel
            const rightPanner = audioContextRef.current.createStereoPanner();
            rightPanner.pan.value = 1; // Hard Right
            rightPanner.connect(masterGainRef.current);

            rightGainRef.current = audioContextRef.current.createGain();
            rightGainRef.current.connect(rightPanner);

            // Both Ears Channel (center)
            bothEarsGainRef.current = audioContextRef.current.createGain();
            bothEarsGainRef.current.connect(masterGainRef.current);

            // Noise Channel
            noiseGainRef.current = audioContextRef.current.createGain();
            noiseGainRef.current.connect(masterGainRef.current);

            // Noise Filter
            noiseFilterRef.current = audioContextRef.current.createBiquadFilter();
            noiseFilterRef.current.connect(noiseGainRef.current);
        }

        // Ensure volume is synchronized
        if (masterGainRef.current) {
            masterGainRef.current.gain.value = volume;
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(e => console.error("Resume failed", e));
        }
    }, [volume]);

    // Unlock AudioContext on iOS
    useEffect(() => {
        const unlockAudio = () => {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    // Cleanup Mobile Audio on unmount
    useEffect(() => {
        return () => disableMobileAudio();
    }, []);

    // Noise Generator
    const createNoiseBuffer = (ctx, type) => {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        if (type === 'pink') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
            return buffer;
        } else if (type === 'brown' || type === 'red') {
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5; // (roughly) compensate for gain
            }
            return buffer;
        }
        // Default to White Noise for all filtered types
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    };

    const soundscapeNodesRef = useRef([]);

    // Soundscape Generators
    const createSoundscape = (ctx, type, destination) => {
        const nodes = [];
        const now = ctx.currentTime;

        if (type === 'ocean') {
            // Pink Noise
            const buffer = createNoiseBuffer(ctx, 'pink');
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;

            // LFO for waves
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1; // Slow waves

            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.3; // Modulation depth

            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(destination);

            source.start();
            lfo.start();

            gain.gain.setValueAtTime(0.2, now); // Base volume

            nodes.push(source, gain, filter, lfo, lfoGain);
        }
        else if (type === 'rain') {
            // Gentler rain: Pink noise with softer filtering
            const buffer = createNoiseBuffer(ctx, 'pink');
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1200; // Softer, less harsh
            filter.Q.value = 0.5;

            const gain = ctx.createGain();
            gain.gain.value = 0.25; // Quieter

            source.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            source.start();

            nodes.push(source, filter, gain);
        }
        else if (type === 'firewood') {
            // Realistic crackling fire with base rumble + varied crackles + pops

            // Base fire rumble (low brown noise)
            const rumbleBuffer = createNoiseBuffer(ctx, 'brown');
            const rumbleSource = ctx.createBufferSource();
            rumbleSource.buffer = rumbleBuffer;
            rumbleSource.loop = true;

            const rumbleFilter = ctx.createBiquadFilter();
            rumbleFilter.type = 'lowpass';
            rumbleFilter.frequency.value = 150;

            const rumbleGain = ctx.createGain();
            rumbleGain.gain.value = 0.2;

            rumbleSource.connect(rumbleFilter);
            rumbleFilter.connect(rumbleGain);
            rumbleGain.connect(destination);
            rumbleSource.start();

            // Small crackles (frequent, quiet)
            const smallCrackleInterval = setInterval(() => {
                if (Math.random() > 0.4) {
                    const t = ctx.currentTime;
                    const buffer = createNoiseBuffer(ctx, 'white');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 1200 + Math.random() * 1500;
                    filter.Q.value = 3;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(Math.random() * 0.15, t + 0.005);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.1);

                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(destination);
                    source.start(t);
                    source.stop(t + 0.2);
                }
            }, 80 + Math.random() * 120);

            // Large pops (occasional, louder)
            const largeCrackleInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    const t = ctx.currentTime;
                    const buffer = createNoiseBuffer(ctx, 'white');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 600 + Math.random() * 800;
                    filter.Q.value = 2;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(Math.random() * 0.4, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15 + Math.random() * 0.25);

                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(destination);
                    source.start(t);
                    source.stop(t + 0.5);
                }
            }, 400 + Math.random() * 600);

            nodes.push(rumbleSource, rumbleFilter, rumbleGain,
                { stop: () => { clearInterval(smallCrackleInterval); clearInterval(largeCrackleInterval); } });
        }
        else if (type === 'nature-walk') {
            // Realistic nature: wind + leaves + multiple bird types + occasional stream

            // Wind (brown noise base)
            const windBuffer = createNoiseBuffer(ctx, 'brown');
            const windSource = ctx.createBufferSource();
            windSource.buffer = windBuffer;
            windSource.loop = true;

            const windFilter = ctx.createBiquadFilter();
            windFilter.type = 'lowpass';
            windFilter.frequency.value = 250;

            const windGain = ctx.createGain();
            windGain.gain.value = 0.12;

            // LFO for wind gusts
            const windLFO = ctx.createOscillator();
            windLFO.frequency.value = 0.08;
            const windLFOGain = ctx.createGain();
            windLFOGain.gain.value = 0.08;
            windLFO.connect(windLFOGain);
            windLFOGain.connect(windGain.gain);
            windLFO.start();

            windSource.connect(windFilter);
            windFilter.connect(windGain);
            windGain.connect(destination);
            windSource.start();

            // Rustling leaves (high-freq filtered noise bursts)
            const leavesInterval = setInterval(() => {
                if (Math.random() > 0.5) {
                    const t = ctx.currentTime;
                    const buffer = createNoiseBuffer(ctx, 'white');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.value = 2000 + Math.random() * 2000;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(destination);
                    source.start(t);
                    source.stop(t + 0.4);
                }
            }, 800 + Math.random() * 1200);

            // Bird chirps - variety of types
            const birdInterval = setInterval(() => {
                if (Math.random() > 0.6) {
                    const t = ctx.currentTime;
                    const birdType = Math.random();

                    if (birdType < 0.4) {
                        // High chirp
                        const osc = ctx.createOscillator();
                        osc.frequency.setValueAtTime(2000 + Math.random() * 1500, t);
                        osc.frequency.exponentialRampToValueAtTime(2500 + Math.random() * 1000, t + 0.1);

                        const gain = ctx.createGain();
                        gain.gain.setValueAtTime(0, t);
                        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

                        osc.connect(gain);
                        gain.connect(destination);
                        osc.start(t);
                        osc.stop(t + 0.2);
                    } else if (birdType < 0.7) {
                        // Warbling bird
                        const osc = ctx.createOscillator();
                        const lfo = ctx.createOscillator();
                        lfo.frequency.value = 8;
                        const lfoGain = ctx.createGain();
                        lfoGain.gain.value = 100;

                        lfo.connect(lfoGain);
                        lfoGain.connect(osc.frequency);

                        osc.frequency.value = 1500 + Math.random() * 800;

                        const gain = ctx.createGain();
                        gain.gain.setValueAtTime(0, t);
                        gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

                        osc.connect(gain);
                        gain.connect(destination);
                        osc.start(t);
                        lfo.start(t);
                        osc.stop(t + 0.35);
                        lfo.stop(t + 0.35);
                    } else {
                        // Low coo
                        const osc = ctx.createOscillator();
                        osc.frequency.value = 400 + Math.random() * 300;

                        const gain = ctx.createGain();
                        gain.gain.setValueAtTime(0, t);
                        gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

                        osc.connect(gain);
                        gain.connect(destination);
                        osc.start(t);
                        osc.stop(t + 0.5);
                    }
                }
            }, 2000 + Math.random() * 4000);

            // Occasional stream babble
            const streamInterval = setInterval(() => {
                if (Math.random() > 0.8) {
                    const t = ctx.currentTime;
                    const buffer = createNoiseBuffer(ctx, 'white');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 800 + Math.random() * 600;
                    filter.Q.value = 0.8;

                    const gain = ctx.createGain();
                    gain.gain.value = 0.15;

                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(destination);
                    source.start(t);
                    source.stop(t + 1 + Math.random() * 2);
                }
            }, 5000 + Math.random() * 10000);

            nodes.push(windSource, windFilter, windGain, windLFO, windLFOGain,
                { stop: () => { clearInterval(leavesInterval); clearInterval(birdInterval); clearInterval(streamInterval); } });
        }
        else if (type === 'japanese-garden') {
            // Realistic Japanese garden: bamboo knocks + water drips + wind chimes + ambient

            // Subtle ambient (very quiet pink noise)
            const ambientBuffer = createNoiseBuffer(ctx, 'pink');
            const ambientSource = ctx.createBufferSource();
            ambientSource.buffer = ambientBuffer;
            ambientSource.loop = true;

            const ambientFilter = ctx.createBiquadFilter();
            ambientFilter.type = 'lowpass';
            ambientFilter.frequency.value = 500;

            const ambientGain = ctx.createGain();
            ambientGain.gain.value = 0.05;

            ambientSource.connect(ambientFilter);
            ambientFilter.connect(ambientGain);
            ambientGain.connect(destination);
            ambientSource.start();

            // Bamboo knocking (low wooden sounds)
            const bambooInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    const t = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    osc.frequency.value = 120 + Math.random() * 80;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

                    osc.connect(gain);
                    gain.connect(destination);
                    osc.start(t);
                    osc.stop(t + 0.2);
                }
            }, 3000 + Math.random() * 5000);

            // Water drips (varied pitch and timing)
            const dripInterval = setInterval(() => {
                const t = ctx.currentTime;
                const pitch = 700 + Math.random() * 400;

                const osc = ctx.createOscillator();
                osc.frequency.setValueAtTime(pitch, t);
                osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, t + 0.05);

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.18, t + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

                osc.connect(gain);
                gain.connect(destination);
                osc.start(t);
                osc.stop(t + 0.25);
            }, 1200 + Math.random() * 2000);

            // Wind chimes (FM synthesis with long decay)
            const chimeInterval = setInterval(() => {
                if (Math.random() > 0.75) {
                    const t = ctx.currentTime;
                    const baseFreq = 800 + Math.random() * 1200;

                    // Create multiple harmonics for richer sound
                    [1, 2.1, 3.3, 4.7].forEach((harmonic, i) => {
                        const carrier = ctx.createOscillator();
                        carrier.frequency.value = baseFreq * harmonic;

                        const modulator = ctx.createOscillator();
                        modulator.frequency.value = baseFreq * harmonic * 1.4;

                        const modGain = ctx.createGain();
                        modGain.gain.value = 50;

                        modulator.connect(modGain);
                        modGain.connect(carrier.frequency);

                        const gain = ctx.createGain();
                        const amplitude = 0.06 / (i + 1); // Quieter harmonics
                        gain.gain.setValueAtTime(0, t);
                        gain.gain.linearRampToValueAtTime(amplitude, t + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 3 + Math.random() * 2);

                        carrier.connect(gain);
                        gain.connect(destination);
                        carrier.start(t);
                        modulator.start(t);
                        carrier.stop(t + 5);
                        modulator.stop(t + 5);
                    });
                }
            }, 4000 + Math.random() * 8000);

            nodes.push(ambientSource, ambientFilter, ambientGain,
                { stop: () => { clearInterval(bambooInterval); clearInterval(dripInterval); clearInterval(chimeInterval); } });
        }
        else if (type === 'thunder') {
            // Low rumble with occasional peaks
            const rumbleBuffer = createNoiseBuffer(ctx, 'brown');
            const rumbleSource = ctx.createBufferSource();
            rumbleSource.buffer = rumbleBuffer;
            rumbleSource.loop = true;

            const rumbleFilter = ctx.createBiquadFilter();
            rumbleFilter.type = 'lowpass';
            rumbleFilter.frequency.value = 80;

            const rumbleGain = ctx.createGain();
            rumbleGain.gain.value = 0.3;

            rumbleSource.connect(rumbleFilter);
            rumbleFilter.connect(rumbleGain);
            rumbleGain.connect(destination);
            rumbleSource.start();

            // Thunder claps
            const thunderInterval = setInterval(() => {
                const t = ctx.currentTime;
                const buffer = createNoiseBuffer(ctx, 'white');
                const source = ctx.createBufferSource();
                source.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 200;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.6, t + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 2);

                source.connect(filter);
                filter.connect(gain);
                gain.connect(destination);
                source.start(t);
                source.stop(t + 2.5);
            }, 8000 + Math.random() * 12000);

            nodes.push(rumbleSource, rumbleFilter, rumbleGain, { stop: () => clearInterval(thunderInterval) });
        }
        else if (type === 'waterfall') {
            // White noise + low rumble
            const whiteBuffer = createNoiseBuffer(ctx, 'white');
            const whiteSource = ctx.createBufferSource();
            whiteSource.buffer = whiteBuffer;
            whiteSource.loop = true;

            const whiteFilter = ctx.createBiquadFilter();
            whiteFilter.type = 'highpass';
            whiteFilter.frequency.value = 400;

            const whiteGain = ctx.createGain();
            whiteGain.gain.value = 0.3;

            whiteSource.connect(whiteFilter);
            whiteFilter.connect(whiteGain);
            whiteGain.connect(destination);
            whiteSource.start();

            // Low rumble
            const rumbleOsc = ctx.createOscillator();
            rumbleOsc.frequency.value = 60;
            const rumbleGain = ctx.createGain();
            rumbleGain.gain.value = 0.2;

            rumbleOsc.connect(rumbleGain);
            rumbleGain.connect(destination);
            rumbleOsc.start();

            nodes.push(whiteSource, whiteFilter, whiteGain, rumbleOsc, rumbleGain);
        }
        else if (type === 'cat-purr') {
            // Low frequency oscillation ~25Hz
            const purr = ctx.createOscillator();
            purr.type = 'triangle';
            purr.frequency.value = 25;

            const purrGain = ctx.createGain();
            purrGain.gain.value = 0.3;

            // LFO for vibrato
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 2;

            lfo.connect(lfoGain);
            lfoGain.connect(purr.frequency);

            purr.connect(purrGain);
            purrGain.connect(destination);
            purr.start();
            lfo.start();

            nodes.push(purr, purrGain, lfo, lfoGain);
        }
        else if (type === 'in-utero') {
            // Heartbeat + muffled pink noise
            const pinkBuffer = createNoiseBuffer(ctx, 'pink');
            const pinkSource = ctx.createBufferSource();
            pinkSource.buffer = pinkBuffer;
            pinkSource.loop = true;

            const pinkFilter = ctx.createBiquadFilter();
            pinkFilter.type = 'lowpass';
            pinkFilter.frequency.value = 200;

            const pinkGain = ctx.createGain();
            pinkGain.gain.value = 0.2;

            pinkSource.connect(pinkFilter);
            pinkFilter.connect(pinkGain);
            pinkGain.connect(destination);
            pinkSource.start();

            // Heartbeat
            const heartbeatInterval = setInterval(() => {
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                osc.frequency.value = 60;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

                osc.connect(gain);
                gain.connect(destination);
                osc.start(t);
                osc.stop(t + 0.3);
            }, 800); // ~75 BPM

            nodes.push(pinkSource, pinkFilter, pinkGain, { stop: () => clearInterval(heartbeatInterval) });
        }
        else if (type === 'underwater') {
            // Muffled blue noise + bubbles
            const buffer = createNoiseBuffer(ctx, 'white');
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 600;

            const gain = ctx.createGain();
            gain.gain.value = 0.25;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            source.start();

            // Bubbles (random high-freq pops)
            const bubbleInterval = setInterval(() => {
                if (Math.random() > 0.5) {
                    const t = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    osc.frequency.value = 800 + Math.random() * 1200;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

                    osc.connect(gain);
                    gain.connect(destination);
                    osc.start(t);
                    osc.stop(t + 0.15);
                }
            }, 500 + Math.random() * 1500);

            nodes.push(source, filter, gain, { stop: () => clearInterval(bubbleInterval) });
        }
        else if (type === 'cosmic') {
            // Drone: 3 detuned oscillators
            [110, 112, 220].forEach(freq => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq;

                const gain = ctx.createGain();
                gain.gain.value = 0.1;

                osc.connect(gain);
                gain.connect(destination);
                osc.start();
                nodes.push(osc, gain);
            });
        }
        else if (type === 'earth') {
            // Deep Brown Noise Rumble
            const buffer = createNoiseBuffer(ctx, 'brown');
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 120;

            const gain = ctx.createGain();
            gain.gain.value = 0.6;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            source.start();

            nodes.push(source, filter, gain);
        }
        else if (type === 'tibetan') {
            // FM Synthesis Bell
            const carrier = ctx.createOscillator();
            carrier.frequency.value = 200;

            const modulator = ctx.createOscillator();
            modulator.frequency.value = 280; // Ratio 1.4

            const modGain = ctx.createGain();
            modGain.gain.value = 100;

            const masterGain = ctx.createGain();
            masterGain.gain.value = 0.3;

            modulator.connect(modGain);
            modGain.connect(carrier.frequency);
            carrier.connect(masterGain);
            masterGain.connect(destination);

            carrier.start();
            modulator.start();

            // Simple LFO for vibrato
            const vibrato = ctx.createOscillator();
            vibrato.frequency.value = 4;
            const vibGain = ctx.createGain();
            vibGain.gain.value = 2;
            vibrato.connect(vibGain);
            vibGain.connect(carrier.frequency);
            vibrato.start();

            nodes.push(carrier, modulator, modGain, masterGain, vibrato, vibGain);
        }
        else if (type === 'crystal') {
            // Pure Sine with long reverb feel
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 440; // A4

            const gain = ctx.createGain();
            gain.gain.value = 0.2;

            osc.connect(gain);
            gain.connect(destination);
            osc.start();
            nodes.push(osc, gain);
        }
        else if (type === 'drums') {
            // Simulated Heartbeat (filtered noise burst)
            const interval = setInterval(() => {
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                osc.frequency.value = 60;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

                osc.connect(gain);
                gain.connect(destination);
                osc.start(t);
                osc.stop(t + 0.4);
            }, 1000); // 60 BPM

            nodes.push({ stop: () => clearInterval(interval) });
        }

        return nodes;
    };

    const play = useCallback((leftFreq, rightFreq, bothEarsFreq = 0, noiseType = null, soundscapeType = null, volumes = {}, layers = []) => {
        // Enable Mobile Audio (Wake Lock + Silent Track)
        enableMobileAudio();

        console.log('useBinauralBeat.play called with:', { leftFreq, rightFreq, bothEarsFreq, noiseType, soundscapeType });

        // Default volumes if not provided
        const {
            binaural = 0.7,
            bothEars = 0.5,
            noise = 0.3,
            soundscape = 0.4
        } = volumes;
        initAudio();
        const ctx = audioContextRef.current;
        console.log('AudioContext state:', ctx.state);
        const now = ctx.currentTime;
        const rampTime = 0.5;

        // Cleanup existing extra layers
        if (layersRef.current.length > 0) {
            layersRef.current.forEach(layer => {
                try { if (layer.leftOsc) { layer.leftOsc.stop(); layer.leftOsc.disconnect(); } } catch (e) { }
                try { if (layer.rightOsc) { layer.rightOsc.stop(); layer.rightOsc.disconnect(); } } catch (e) { }
                try { if (layer.leftGain) { layer.leftGain.disconnect(); } } catch (e) { }
                try { if (layer.rightGain) { layer.rightGain.disconnect(); } } catch (e) { }
            });
            layersRef.current = [];
        }

        // Stop existing soundscape
        if (soundscapeNodesRef.current.length > 0) {
            soundscapeNodesRef.current.forEach(node => {
                if (node.stop) {
                    try { node.stop(); } catch (e) { }
                }
                if (node.disconnect) {
                    try { node.disconnect(); } catch (e) { }
                }
            });
            soundscapeNodesRef.current = [];
        }

        // Handle Soundscape
        if (soundscapeType && soundscapeType !== 'none') {
            const soundscapeGain = ctx.createGain();
            soundscapeGainRef.current = soundscapeGain; // Store reference
            soundscapeGain.gain.setValueAtTime(0, now);
            soundscapeGain.gain.linearRampToValueAtTime(soundscape, now + rampTime);
            soundscapeGain.connect(masterGainRef.current);

            const nodes = createSoundscape(ctx, soundscapeType, soundscapeGain);
            nodes.push(soundscapeGain);
            soundscapeNodesRef.current = nodes;
        }

        // Handle Noise
        updateNoise(noiseType, noise);

        // Handle Binaural Beats (Sine Waves)
        const layersToPlay = (layers && layers.length > 0)
            ? layers.map(l => ({ left: l.carrierFreq, right: l.carrierFreq + l.beatFreq, volume: l.volume ?? 0.7 }))
            : (leftFreq > 0 && rightFreq > 0) ? [{ left: leftFreq, right: rightFreq, volume: volumes.binaural ?? 0.7 }] : [];

        layersToPlay.forEach((layer, index) => {
            const lFreq = layer.left;
            const rFreq = layer.right;
            const vol = layer.volume;

            if (index === 0) {
                // Primary Layer (using existing refs)
                if (!isPlaying || !leftOscRef.current) {
                    leftOscRef.current = ctx.createOscillator();
                    leftOscRef.current.type = 'sine';
                    leftOscRef.current.frequency.setValueAtTime(lFreq, now);
                    leftOscRef.current.connect(leftGainRef.current);
                    leftOscRef.current.start();

                    rightOscRef.current = ctx.createOscillator();
                    rightOscRef.current.type = 'sine';
                    rightOscRef.current.frequency.setValueAtTime(rFreq, now);
                    rightOscRef.current.connect(rightGainRef.current);
                    rightOscRef.current.start();

                    // Fade in
                    leftGainRef.current.gain.setValueAtTime(0, now);
                    leftGainRef.current.gain.linearRampToValueAtTime(vol, now + rampTime);

                    rightGainRef.current.gain.setValueAtTime(0, now);
                    rightGainRef.current.gain.linearRampToValueAtTime(vol, now + rampTime);
                } else {
                    // Update frequencies smoothly
                    leftOscRef.current.frequency.linearRampToValueAtTime(lFreq, now + rampTime);
                    rightOscRef.current.frequency.linearRampToValueAtTime(rFreq, now + rampTime);
                    // Update volume
                    if (leftGainRef.current) {
                        leftGainRef.current.gain.cancelScheduledValues(now);
                        leftGainRef.current.gain.setValueAtTime(leftGainRef.current.gain.value, now);
                        leftGainRef.current.gain.linearRampToValueAtTime(vol, now + rampTime);
                    }
                    if (rightGainRef.current) {
                        rightGainRef.current.gain.cancelScheduledValues(now);
                        rightGainRef.current.gain.setValueAtTime(rightGainRef.current.gain.value, now);
                        rightGainRef.current.gain.linearRampToValueAtTime(vol, now + rampTime);
                    }
                }
            } else {
                // Additional Layers
                const lOsc = ctx.createOscillator();
                const rOsc = ctx.createOscillator();
                const lGain = ctx.createGain();
                const rGain = ctx.createGain();

                // Panning for extra layers (reuse main panners via master gain? No, need separate gains connected to panners)
                // Actually, I can connect to the same panners if I want, or create new chains.
                // The main setup has: leftGain -> leftPanner -> masterGain
                // I should create: lOsc -> lGain -> leftPanner (if accessible) or just create new panners?
                // Reusing panners is tricky if I don't have refs to them.
                // In initAudio, panners are created but not stored in refs.
                // I should probably refactor initAudio to store panners or just create new panners for each layer.
                // Creating new panners is safer.

                const lPanner = ctx.createStereoPanner();
                lPanner.pan.value = -1;
                lPanner.connect(masterGainRef.current);

                const rPanner = ctx.createStereoPanner();
                rPanner.pan.value = 1;
                rPanner.connect(masterGainRef.current);

                lOsc.type = 'sine';
                lOsc.frequency.setValueAtTime(lFreq, now);
                lOsc.connect(lGain);
                lGain.connect(lPanner);

                rOsc.type = 'sine';
                rOsc.frequency.setValueAtTime(rFreq, now);
                rOsc.connect(rGain);
                rGain.connect(rPanner);

                lOsc.start();
                rOsc.start();

                // Fade in
                lGain.gain.setValueAtTime(0, now);
                lGain.gain.linearRampToValueAtTime(vol, now + rampTime);

                rGain.gain.setValueAtTime(0, now);
                rGain.gain.linearRampToValueAtTime(vol, now + rampTime);

                layersRef.current.push({
                    leftOsc: lOsc,
                    rightOsc: rOsc,
                    leftGain: lGain,
                    rightGain: rGain,
                    leftPanner: lPanner,
                    rightPanner: rPanner
                });
            }
        });

        if (layersToPlay.length === 0) {
            // Stop sine waves if frequencies are 0 (e.g. noise only mode)
            if (leftOscRef.current) {
                leftGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
                rightGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);

                setTimeout(() => {
                    if (leftOscRef.current) { leftOscRef.current.stop(); leftOscRef.current.disconnect(); leftOscRef.current = null; }
                    if (rightOscRef.current) { rightOscRef.current.stop(); rightOscRef.current.disconnect(); rightOscRef.current = null; }
                }, rampTime * 1000);
            }
        }

        // Handle Both Ears oscillator
        if (bothEarsFreq > 0) {
            if (!bothEarsOscRef.current) {
                bothEarsOscRef.current = ctx.createOscillator();
                bothEarsOscRef.current.type = 'sine';
                bothEarsOscRef.current.frequency.setValueAtTime(bothEarsFreq, now);
                bothEarsOscRef.current.connect(bothEarsGainRef.current);
                bothEarsOscRef.current.start();

                bothEarsGainRef.current.gain.setValueAtTime(0, now);
                bothEarsGainRef.current.gain.linearRampToValueAtTime(bothEars, now + rampTime);
            } else {
                bothEarsOscRef.current.frequency.linearRampToValueAtTime(bothEarsFreq, now + rampTime);
            }
        } else if (bothEarsOscRef.current) {
            // Fade out and stop both ears oscillator
            bothEarsGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            setTimeout(() => {
                if (bothEarsOscRef.current) {
                    bothEarsOscRef.current.stop();
                    bothEarsOscRef.current.disconnect();
                    bothEarsOscRef.current = null;
                }
            }, rampTime * 1000);
        }

        setIsPlaying(true);
        setCurrentFrequencies({ left: leftFreq, right: rightFreq, bothEars: bothEarsFreq, noiseType, soundscapeType });
    }, [initAudio, isPlaying, currentFrequencies]);

    // Update Noise separately
    const updateNoise = useCallback((noiseType, volume = 0.5) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const rampTime = 0.5;

        // Stop existing noise if switching types or turning off
        if (noiseNodeRef.current && (!noiseType || (currentFrequencies.noiseType && noiseType !== currentFrequencies.noiseType))) {
            noiseGainRef.current.gain.cancelScheduledValues(now);
            noiseGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            setTimeout(() => {
                if (noiseNodeRef.current) {
                    noiseNodeRef.current.stop();
                    noiseNodeRef.current.disconnect();
                    noiseNodeRef.current = null;
                }
            }, rampTime * 1000);
        }

        // Start or Update Noise
        if (noiseType) {
            if (!noiseNodeRef.current) {
                // Configure Filter based on Type
                const filter = noiseFilterRef.current;
                filter.type = 'allpass'; filter.frequency.value = 0; filter.Q.value = 1; filter.gain.value = 0;

                switch (noiseType) {
                    case 'blue': filter.type = 'highpass'; filter.frequency.value = 500; break;
                    case 'violet': filter.type = 'highpass'; filter.frequency.value = 2000; break;
                    case 'green': filter.type = 'bandpass'; filter.frequency.value = 500; filter.Q.value = 0.5; break;
                    case 'turquoise': filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 0.5; break;
                    case 'grey': filter.type = 'peaking'; filter.frequency.value = 1000; filter.Q.value = 1; filter.gain.value = -5; break;
                    case 'yellow': filter.type = 'bandpass'; filter.frequency.value = 800; filter.Q.value = 1; break;
                    case 'orange': filter.type = 'lowpass'; filter.frequency.value = 1000; break;
                    case 'burgundy': filter.type = 'lowpass'; filter.frequency.value = 200; break;
                    case 'black': break;
                    default: break;
                }

                const buffer = createNoiseBuffer(ctx, noiseType);
                noiseNodeRef.current = ctx.createBufferSource();
                noiseNodeRef.current.buffer = buffer;
                noiseNodeRef.current.loop = true;
                noiseNodeRef.current.connect(noiseFilterRef.current);
                noiseNodeRef.current.start();

                noiseGainRef.current.gain.setValueAtTime(0, now);
            }

            // Always update gain (Volume)
            const targetGain = noiseType === 'black' ? (volume * 0.1) : volume;
            noiseGainRef.current.gain.linearRampToValueAtTime(targetGain, now + rampTime);

            // Update state to prevent loop restarts
            if (currentFrequencies.noiseType !== noiseType) {
                setCurrentFrequencies(prev => ({ ...prev, noiseType }));
            }
        } else if (currentFrequencies.noiseType) {
            // If noise turned off, update state
            setCurrentFrequencies(prev => ({ ...prev, noiseType: null }));
        }
    }, [currentFrequencies.noiseType]);

    // Update Layers separately to avoid restarting Main/Base oscillators
    const updateLayers = useCallback((newLayers, volumes = {}) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const rampTime = 0.5;

        // Stop current layers
        if (layersRef.current.length > 0) {
            layersRef.current.forEach(layer => {
                if (layer.leftGain) { layer.leftGain.gain.cancelScheduledValues(now); layer.leftGain.gain.linearRampToValueAtTime(0, now + 0.2); }
                if (layer.rightGain) { layer.rightGain.gain.cancelScheduledValues(now); layer.rightGain.gain.linearRampToValueAtTime(0, now + 0.2); }
                setTimeout(() => {
                    if (layer.leftOsc) { layer.leftOsc.stop(); layer.leftOsc.disconnect(); }
                    if (layer.rightOsc) { layer.rightOsc.stop(); layer.rightOsc.disconnect(); }
                    if (layer.leftPanner) { layer.leftPanner.disconnect(); }
                    if (layer.rightPanner) { layer.rightPanner.disconnect(); }
                }, 250);
            });
            layersRef.current = [];
        }

        // Start new layers
        if (newLayers && newLayers.length > 0) {
            newLayers.forEach(layer => {
                const lFreq = layer.carrierFreq;
                const rFreq = layer.carrierFreq + (layer.beatFreq || 0);
                const bVol = (volumes.binaural !== undefined) ? volumes.binaural : 1;
                const vol = (layer.volume !== undefined ? layer.volume : 0.5) * bVol;

                const lOsc = ctx.createOscillator();
                const rOsc = ctx.createOscillator();
                const lGain = ctx.createGain();
                const rGain = ctx.createGain();
                const lPanner = ctx.createStereoPanner();
                const rPanner = ctx.createStereoPanner();

                lPanner.pan.value = -1;
                rPanner.pan.value = 1;
                lPanner.connect(masterGainRef.current);
                rPanner.connect(masterGainRef.current);

                lOsc.type = 'sine';
                lOsc.frequency.setValueAtTime(lFreq, now);
                lOsc.connect(lGain);
                lGain.connect(lPanner);

                rOsc.type = 'sine';
                rOsc.frequency.setValueAtTime(rFreq, now);
                rOsc.connect(rGain);
                rGain.connect(rPanner);

                lOsc.start();
                rOsc.start();

                lGain.gain.setValueAtTime(0, now);
                lGain.gain.linearRampToValueAtTime(vol, now + rampTime);
                rGain.gain.setValueAtTime(0, now);
                rGain.gain.linearRampToValueAtTime(vol, now + rampTime);

                layersRef.current.push({
                    leftOsc: lOsc, rightOsc: rOsc,
                    leftGain: lGain, rightGain: rGain,
                    leftPanner: lPanner, rightPanner: rPanner
                });
            });
        }
    }, [isPlaying]);

    // Update Soundscape separately
    const updateSoundscape = useCallback((type, volume = 0.5) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const rampTime = 0.5;

        console.log('updateSoundscape called:', { type, volume, currentType: currentFrequencies.soundscapeType });

        // If type is the same and we have an active soundscape, just update volume
        if (type && type === currentFrequencies.soundscapeType && soundscapeGainRef.current) {
            console.log('Updating soundscape volume only');
            soundscapeGainRef.current.gain.cancelScheduledValues(now);
            soundscapeGainRef.current.gain.setValueAtTime(soundscapeGainRef.current.gain.value, now);
            soundscapeGainRef.current.gain.linearRampToValueAtTime(volume, now + rampTime);
            return;
        }

        // If turning off soundscape (type is null/none)
        if (!type || type === 'none') {
            if (soundscapeNodesRef.current.length > 0) {
                console.log('Stopping soundscape');
                soundscapeNodesRef.current.forEach(node => {
                    if (node instanceof GainNode) {
                        try { node.gain.linearRampToValueAtTime(0, now + rampTime); } catch (e) { }
                    } else {
                        try { if (node.stop) node.stop(now + rampTime); } catch (e) { }
                    }
                });
                setTimeout(() => {
                    soundscapeNodesRef.current.forEach(node => {
                        try { if (node.disconnect) node.disconnect(); } catch (e) { }
                    });
                    soundscapeNodesRef.current = [];
                    soundscapeGainRef.current = null;
                }, rampTime * 1000 + 100);

                setCurrentFrequencies(prev => ({ ...prev, soundscapeType: null }));
            }
            return;
        }

        // Type changed - stop old and start new
        console.log('Changing soundscape type from', currentFrequencies.soundscapeType, 'to', type);

        // Stop existing
        if (soundscapeNodesRef.current.length > 0) {
            soundscapeNodesRef.current.forEach(node => {
                if (node instanceof GainNode) {
                    try { node.gain.linearRampToValueAtTime(0, now + 0.2); } catch (e) { }
                } else {
                    try { if (node.stop) node.stop(now + 0.2); } catch (e) { }
                }
            });
            setTimeout(() => {
                soundscapeNodesRef.current.forEach(node => {
                    try { if (node.disconnect) node.disconnect(); } catch (e) { }
                });
                soundscapeNodesRef.current = [];
            }, 300);
        }

        // Start New
        const soundscapeGain = ctx.createGain();
        soundscapeGainRef.current = soundscapeGain;
        soundscapeGain.gain.setValueAtTime(0, now + 0.25); // Slight delay to avoid overlap
        soundscapeGain.gain.linearRampToValueAtTime(volume, now + 0.25 + rampTime);
        soundscapeGain.connect(masterGainRef.current);

        const nodes = createSoundscape(ctx, type, soundscapeGain);
        nodes.push(soundscapeGain);
        soundscapeNodesRef.current = nodes;

        setCurrentFrequencies(prev => ({ ...prev, soundscapeType: type }));
    }, [currentFrequencies.soundscapeType]);

    const stop = useCallback(() => {
        if (audioContextRef.current && isPlaying) {
            const now = audioContextRef.current.currentTime;
            const rampTime = 0.5;

            // Fade out
            if (leftGainRef.current) leftGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            if (rightGainRef.current) rightGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            if (bothEarsGainRef.current) bothEarsGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            if (noiseGainRef.current) noiseGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);

            // Stop Soundscapes
            if (soundscapeNodesRef.current.length > 0) {
                soundscapeNodesRef.current.forEach(node => {
                    // If it's a gain node, ramp it down
                    if (node instanceof GainNode) {
                        try { node.gain.linearRampToValueAtTime(0, now + rampTime); } catch (e) { }
                    }
                });
            }

            setTimeout(() => {
                if (leftOscRef.current) { leftOscRef.current.stop(); leftOscRef.current.disconnect(); leftOscRef.current = null; }
                if (rightOscRef.current) { rightOscRef.current.stop(); rightOscRef.current.disconnect(); rightOscRef.current = null; }

                // Stop Extra Layers
                if (layersRef.current.length > 0) {
                    layersRef.current.forEach(layer => {
                        try { if (layer.leftOsc) { layer.leftOsc.stop(); layer.leftOsc.disconnect(); } } catch (e) { }
                        try { if (layer.rightOsc) { layer.rightOsc.stop(); layer.rightOsc.disconnect(); } } catch (e) { }
                        try { if (layer.leftGain) { layer.leftGain.disconnect(); } } catch (e) { }
                        try { if (layer.rightGain) { layer.rightGain.disconnect(); } } catch (e) { }
                    });
                    layersRef.current = [];
                }

                if (bothEarsOscRef.current) { bothEarsOscRef.current.stop(); bothEarsOscRef.current.disconnect(); bothEarsOscRef.current = null; }
                if (noiseNodeRef.current) { noiseNodeRef.current.stop(); noiseNodeRef.current.disconnect(); noiseNodeRef.current = null; }

                // Stop Soundscape Nodes
                if (soundscapeNodesRef.current.length > 0) {
                    soundscapeNodesRef.current.forEach(node => {
                        if (node.stop) { try { node.stop(); } catch (e) { } }
                        if (node.disconnect) { try { node.disconnect(); } catch (e) { } }
                    });
                    soundscapeNodesRef.current = [];
                }

                disableMobileAudio();
                setIsPlaying(false);
                setCurrentFrequencies({ left: 0, right: 0, bothEars: 0, noiseType: null, soundscapeType: null });
            }, rampTime * 1000);
        }
    }, [isPlaying]);

    const updateVolume = useCallback((val) => {
        setVolume(val);
        if (masterGainRef.current) {
            masterGainRef.current.gain.setTargetAtTime(val, audioContextRef.current.currentTime, 0.1);
        }
    }, []);

    const enableMicrophone = useCallback(async () => {
        if (!audioContextRef.current) initAudio();
        // Ensure context is running
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            micStreamRef.current = stream;

            const ctx = audioContextRef.current;
            const source = ctx.createMediaStreamSource(stream);
            const gain = ctx.createGain();
            gain.gain.value = 1.0;

            source.connect(gain);
            gain.connect(ctx.destination);

            micSourceRef.current = source;
            micGainRef.current = gain;
            setIsMicActive(true);
            return true;
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Could not access microphone: " + err.message);
            return false;
        }
    }, [initAudio]);

    const disableMicrophone = useCallback(() => {
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
            micStreamRef.current = null;
        }
        if (micSourceRef.current) {
            micSourceRef.current.disconnect();
            micSourceRef.current = null;
        }
        setIsMicActive(false);
    }, []);

    const setMicVolume = useCallback((val) => {
        if (micGainRef.current) {
            // Smooth transition
            micGainRef.current.gain.setTargetAtTime(val, audioContextRef.current.currentTime, 0.1);
        }
    }, []);

    return {
        play,
        stop,
        isPlaying,
        volume,
        setVolume: updateVolume,
        setVolume: updateVolume,
        currentFrequencies,
        enableMicrophone,
        disableMicrophone,
        setMicVolume,
        isMicActive,
        updateLayers,
        updateNoise,
        updateSoundscape
    };
}
