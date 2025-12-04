import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Play, Pause } from 'lucide-react';
import './EnergyCleanseMode.css';

export function EnergyCleanseMode({ onBack }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [direction, setDirection] = useState('rising'); // 'rising' or 'falling'
    const [currentFreq, setCurrentFreq] = useState(40);

    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Initialize Audio Context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();

        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0;

        return () => {
            if (oscillatorRef.current) {
                oscillatorRef.current.stop();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const startSweep = () => {
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        const duration = 180; // 3 minutes
        const startFreq = direction === 'rising' ? 40 : 963;
        const endFreq = direction === 'rising' ? 963 : 40;

        // Create oscillator
        oscillatorRef.current = ctx.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(startFreq, now);
        oscillatorRef.current.connect(gainNodeRef.current);
        oscillatorRef.current.start();

        // Fade in
        gainNodeRef.current.gain.setValueAtTime(0, now);
        gainNodeRef.current.gain.linearRampToValueAtTime(0.3, now + 2);

        // Sweep frequency
        oscillatorRef.current.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        // Auto-stop after duration
        setTimeout(() => {
            stopSweep();
        }, duration * 1000);

        setIsPlaying(true);
        setCurrentFreq(startFreq);

        // Update frequency display
        const updateDisplay = () => {
            if (oscillatorRef.current) {
                const freq = oscillatorRef.current.frequency.value;
                setCurrentFreq(Math.round(freq));
                animationFrameRef.current = requestAnimationFrame(updateDisplay);
            }
        };
        updateDisplay();
    };

    const stopSweep = () => {
        if (!oscillatorRef.current) return;

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        // Fade out
        gainNodeRef.current.gain.linearRampToValueAtTime(0, now + 1);

        setTimeout(() => {
            if (oscillatorRef.current) {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
                oscillatorRef.current = null;
            }
            setIsPlaying(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }, 1000);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            stopSweep();
        } else {
            startSweep();
        }
    };

    return (
        <div className="energy-cleanse-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <div className="cleanse-container">
                <h1 className="cleanse-title">Energy Cleanse Mode</h1>
                <p className="cleanse-subtitle">
                    A sonic sweep to clear your energetic field
                </p>

                {/* Direction Selector */}
                <div className="direction-selector">
                    <button
                        className={`direction-btn ${direction === 'rising' ? 'active' : ''}`}
                        onClick={() => !isPlaying && setDirection('rising')}
                        disabled={isPlaying}
                    >
                        <ArrowUp size={24} />
                        <div>
                            <div className="direction-label">Rising</div>
                            <div className="direction-desc">Root → Crown</div>
                            <div className="direction-freq">40 Hz → 963 Hz</div>
                        </div>
                    </button>

                    <button
                        className={`direction-btn ${direction === 'falling' ? 'active' : ''}`}
                        onClick={() => !isPlaying && setDirection('falling')}
                        disabled={isPlaying}
                    >
                        <ArrowDown size={24} />
                        <div>
                            <div className="direction-label">Falling</div>
                            <div className="direction-desc">Crown → Root</div>
                            <div className="direction-freq">963 Hz → 40 Hz</div>
                        </div>
                    </button>
                </div>

                {/* Frequency Display */}
                <div className={`frequency-display ${isPlaying ? 'active' : ''}`}>
                    <div className="freq-value">{currentFreq}</div>
                    <div className="freq-unit">Hz</div>
                </div>

                {/* Play/Pause Button */}
                <button
                    className={`cleanse-play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={handlePlayPause}
                >
                    {isPlaying ? (
                        <>
                            <Pause size={32} />
                            <span>Stop Cleanse</span>
                        </>
                    ) : (
                        <>
                            <Play size={32} />
                            <span>Start Cleanse (3 min)</span>
                        </>
                    )}
                </button>

                {isPlaying && (
                    <div className="cleanse-message">
                        <div className="pulse-dot"></div>
                        <span>Sweeping your field...</span>
                    </div>
                )}
            </div>

            <footer className="page-footer">
                <div>OMNISYNC™</div>
                <div>© NeoTheory Music 2025</div>
            </footer>
        </div>
    );
}
