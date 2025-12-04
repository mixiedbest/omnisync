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
            const buffer = createNoiseBuffer(ctx, 'pink');
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 800;

            const gain = ctx.createGain();
            gain.gain.value = 0.4;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            source.start();

            nodes.push(source, filter, gain);
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
