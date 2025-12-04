import { useRef, useState, useEffect, useCallback } from 'react';

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

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentFrequencies, setCurrentFrequencies] = useState({ left: 0, right: 0, bothEars: 0, noiseType: null });

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

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
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
            // Crackling fire: Random noise bursts
            const interval = setInterval(() => {
                if (Math.random() > 0.3) { // 70% chance of crackle
                    const t = ctx.currentTime;
                    const buffer = createNoiseBuffer(ctx, 'white');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 800 + Math.random() * 1200;
                    filter.Q.value = 2;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(Math.random() * 0.3, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + Math.random() * 0.2);

                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(destination);
                    source.start(t);
                    source.stop(t + 0.4);
                }
            }, 100 + Math.random() * 200); // Random timing

            nodes.push({ stop: () => clearInterval(interval) });
        }
        else if (type === 'nature-walk') {
            // Layered: Brown noise (wind) + chirps + water
            const windBuffer = createNoiseBuffer(ctx, 'brown');
            const windSource = ctx.createBufferSource();
            windSource.buffer = windBuffer;
            windSource.loop = true;

            const windFilter = ctx.createBiquadFilter();
            windFilter.type = 'lowpass';
            windFilter.frequency.value = 300;

            const windGain = ctx.createGain();
            windGain.gain.value = 0.15;

            windSource.connect(windFilter);
            windFilter.connect(windGain);
            windGain.connect(destination);
            windSource.start();

            // Bird chirps (random high-freq oscillators)
            const birdInterval = setInterval(() => {
                if (Math.random() > 0.6) {
                    const t = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    osc.frequency.value = 1500 + Math.random() * 2000;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

                    osc.connect(gain);
                    gain.connect(destination);
                    osc.start(t);
                    osc.stop(t + 0.3);
                }
            }, 2000 + Math.random() * 3000);

            nodes.push(windSource, windFilter, windGain, { stop: () => clearInterval(birdInterval) });
        }
        else if (type === 'japanese-garden') {
            // Water drips + bamboo + chimes
            const dripInterval = setInterval(() => {
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                osc.frequency.value = 800;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

                osc.connect(gain);
                gain.connect(destination);
                osc.start(t);
                osc.stop(t + 0.4);
            }, 1500 + Math.random() * 2500);

            // Wind chime (FM synthesis, occasional)
            const chimeInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    const t = ctx.currentTime;
                    const carrier = ctx.createOscillator();
                    carrier.frequency.value = 1200 + Math.random() * 800;

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 2);

                    carrier.connect(gain);
                    gain.connect(destination);
                    carrier.start(t);
                    carrier.stop(t + 2.5);
                }
            }, 4000 + Math.random() * 6000);

            nodes.push({ stop: () => { clearInterval(dripInterval); clearInterval(chimeInterval); } });
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

    const play = useCallback((leftFreq, rightFreq, bothEarsFreq = 0, noiseType = null, soundscapeType = null) => {
        initAudio();
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const rampTime = 0.5;

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
        if (soundscapeType) {
            const nodes = createSoundscape(ctx, soundscapeType, masterGainRef.current);
            soundscapeNodesRef.current = nodes;
        }

        // Stop existing noise if switching types or turning off
        if (noiseNodeRef.current && (!noiseType || noiseType !== currentFrequencies.noiseType)) {
            noiseGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            setTimeout(() => {
                if (noiseNodeRef.current) {
                    noiseNodeRef.current.stop();
                    noiseNodeRef.current.disconnect();
                    noiseNodeRef.current = null;
                }
            }, rampTime * 1000);
        }

        // Handle Noise
        if (noiseType) {
            if (!noiseNodeRef.current) {
                // Configure Filter based on Type
                const filter = noiseFilterRef.current;
                // Reset filter
                filter.type = 'allpass';
                filter.frequency.value = 0;
                filter.Q.value = 1; // Reset Q
                filter.gain.value = 0; // Reset gain for peaking

                switch (noiseType) {
                    case 'blue':
                        filter.type = 'highpass';
                        filter.frequency.value = 500;
                        break;
                    case 'violet':
                        filter.type = 'highpass';
                        filter.frequency.value = 2000;
                        break;
                    case 'green':
                        filter.type = 'bandpass';
                        filter.frequency.value = 500;
                        filter.Q.value = 0.5;
                        break;
                    case 'turquoise':
                        filter.type = 'bandpass';
                        filter.frequency.value = 2000;
                        filter.Q.value = 0.5;
                        break;
                    case 'grey':
                        // Approximate grey with a gentle bandpass
                        filter.type = 'peaking';
                        filter.frequency.value = 1000;
                        filter.Q.value = 1;
                        filter.gain.value = -5;
                        break;
                    case 'yellow':
                        filter.type = 'bandpass';
                        filter.frequency.value = 800;
                        filter.Q.value = 1;
                        break;
                    case 'orange':
                        filter.type = 'lowpass';
                        filter.frequency.value = 1000;
                        break;
                    case 'burgundy':
                        filter.type = 'lowpass';
                        filter.frequency.value = 200;
                        break;
                    case 'black':
                        // Silence (handled by gain)
                        break;
                    default:
                        // White, Pink, Brown, Red use their specific buffers and no filter (or default white)
                        break;
                }

                const buffer = createNoiseBuffer(ctx, noiseType);
                noiseNodeRef.current = ctx.createBufferSource();
                noiseNodeRef.current.buffer = buffer;
                noiseNodeRef.current.loop = true;

                // Connect: Source -> Filter -> Gain -> Master
                noiseNodeRef.current.connect(noiseFilterRef.current);

                noiseNodeRef.current.start();

                // Gain handling
                noiseGainRef.current.gain.setValueAtTime(0, now);
                const targetGain = noiseType === 'black' ? 0.05 : 0.5; // Very low for black
                noiseGainRef.current.gain.linearRampToValueAtTime(targetGain, now + rampTime);
            }
            // If noise is already playing and type is same, do nothing (it loops)
        }

        // Handle Binaural Beats (Sine Waves)
        if (leftFreq > 0 && rightFreq > 0) {
            // If not playing, start oscillators
            if (!isPlaying || !leftOscRef.current) {
                // Create Left/Right Oscillators
                leftOscRef.current = ctx.createOscillator();
                leftOscRef.current.type = 'sine';
                leftOscRef.current.frequency.setValueAtTime(leftFreq, now);
                leftOscRef.current.connect(leftGainRef.current);
                leftOscRef.current.start();

                rightOscRef.current = ctx.createOscillator();
                rightOscRef.current.type = 'sine';
                rightOscRef.current.frequency.setValueAtTime(rightFreq, now);
                rightOscRef.current.connect(rightGainRef.current);
                rightOscRef.current.start();

                // Fade in
                leftGainRef.current.gain.setValueAtTime(0, now);
                leftGainRef.current.gain.linearRampToValueAtTime(0.7, now + rampTime);

                rightGainRef.current.gain.setValueAtTime(0, now);
                rightGainRef.current.gain.linearRampToValueAtTime(0.7, now + rampTime);
            } else {
                // Update frequencies smoothly
                leftOscRef.current.frequency.linearRampToValueAtTime(leftFreq, now + rampTime);
                rightOscRef.current.frequency.linearRampToValueAtTime(rightFreq, now + rampTime);
            }
        } else {
            // Stop sine waves if frequencies are 0 (e.g. noise only mode)
            if (leftOscRef.current) {
                leftGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
                rightGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
                setTimeout(() => {
                    if (leftOscRef.current) { leftOscRef.current.stop(); leftOscRef.current = null; }
                    if (rightOscRef.current) { rightOscRef.current.stop(); rightOscRef.current = null; }
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
                bothEarsGainRef.current.gain.linearRampToValueAtTime(0.5, now + rampTime);
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

    return {
        play,
        stop,
        isPlaying,
        volume,
        setVolume: updateVolume,
        currentFrequencies
    };
}
