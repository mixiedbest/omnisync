import { useRef, useState, useEffect, useCallback } from 'react';

export function useBinauralBeat() {
    const audioContextRef = useRef(null);
    const leftOscRef = useRef(null);
    const rightOscRef = useRef(null);
    const bothEarsOscRef = useRef(null);
    const leftGainRef = useRef(null);
    const rightGainRef = useRef(null);
    const bothEarsGainRef = useRef(null);
    const masterGainRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentFrequencies, setCurrentFrequencies] = useState({ left: 0, right: 0, bothEars: 0 });

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

    const play = useCallback((leftFreq, rightFreq, bothEarsFreq = 0) => {
        initAudio();
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        const rampTime = 0.5; // Smooth transition

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

            setIsPlaying(true);
        } else {
            // Update frequencies smoothly
            leftOscRef.current.frequency.linearRampToValueAtTime(leftFreq, now + rampTime);
            rightOscRef.current.frequency.linearRampToValueAtTime(rightFreq, now + rampTime);
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

        setCurrentFrequencies({ left: leftFreq, right: rightFreq, bothEars: bothEarsFreq });
    }, [initAudio, isPlaying]);

    const stop = useCallback(() => {
        if (audioContextRef.current && isPlaying) {
            const now = audioContextRef.current.currentTime;
            const rampTime = 0.5;

            // Fade out
            leftGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            rightGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            if (bothEarsGainRef.current) {
                bothEarsGainRef.current.gain.linearRampToValueAtTime(0, now + rampTime);
            }

            setTimeout(() => {
                if (leftOscRef.current) {
                    leftOscRef.current.stop();
                    leftOscRef.current.disconnect();
                    leftOscRef.current = null;
                }
                if (rightOscRef.current) {
                    rightOscRef.current.stop();
                    rightOscRef.current.disconnect();
                    rightOscRef.current = null;
                }
                if (bothEarsOscRef.current) {
                    bothEarsOscRef.current.stop();
                    bothEarsOscRef.current.disconnect();
                    bothEarsOscRef.current = null;
                }
                setIsPlaying(false);
                setCurrentFrequencies({ left: 0, right: 0, bothEars: 0 });
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
