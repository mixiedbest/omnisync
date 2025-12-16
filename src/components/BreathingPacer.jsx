import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Wind, Settings } from 'lucide-react';
import './BreathingPacer.css';

const BREATHING_PATTERNS = {
    box: {
        name: 'Box Breathing',
        description: 'Equal timing for calm & focus',
        phases: ['Inhale', 'Hold', 'Exhale', 'Hold'],
        timings: [4, 4, 4, 4],
        color: '#60a5fa'
    },
    '4-7-8': {
        name: '4-7-8 Relaxing',
        description: 'Deep relaxation & sleep',
        phases: ['Inhale', 'Hold', 'Exhale'],
        timings: [4, 7, 8],
        color: '#818cf8'
    },
    energizing: {
        name: 'Energizing Breath',
        description: 'Quick energy boost',
        phases: ['Inhale', 'Hold', 'Exhale'],
        timings: [3, 3, 6],
        color: '#f59e0b'
    },
    golden: {
        name: 'Golden Ratio (φ)',
        description: 'φ-timed breathing (4s / 6.5s)',
        phases: ['Inhale', 'Exhale'],
        timings: [4, 6.5],
        color: '#fbbf24'
    }
};

export function BreathingPacer({ onClose, pattern: initialPattern = 'box' }) {
    const [selectedPattern, setSelectedPattern] = useState(initialPattern);
    const [text, setText] = useState('Inhale');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    const pattern = BREATHING_PATTERNS[selectedPattern];

    // Update pattern when prop changes (for journey phase transitions)
    useEffect(() => {
        setSelectedPattern(initialPattern);
    }, [initialPattern]);

    // Timer logic
    useEffect(() => {
        let timeoutId;
        let currentPhaseIndex = 0;

        const runPhase = () => {
            const phase = pattern.phases[currentPhaseIndex];
            const duration = pattern.timings[currentPhaseIndex];

            setText(phase);
            setPhaseIndex(currentPhaseIndex);

            timeoutId = setTimeout(() => {
                currentPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length;
                runPhase();
            }, duration * 1000);
        };

        runPhase();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedPattern, pattern]);

    // Manual Positioning & Scroll Lock
    // We use position: absolute + top: scrollY + body scroll lock
    // This places the overlay exactly where the user is looking and prevents scrolling away.
    // This bypasses any browser quirks with position: fixed.
    useEffect(() => {
        // 1. Lock Body Scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        // 2. Set Position
        const overlay = document.querySelector('.breathing-overlay');
        if (overlay) {
            overlay.style.position = 'absolute';
            overlay.style.top = `${window.scrollY}px`;
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = `${window.innerHeight}px`;
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Use createPortal to render outside of any parent containers that might break positioning
    return createPortal(
        <div className="breathing-overlay">
            <div className="breathing-overlay-content">
                <button className="close-pacer-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <button
                    className={`settings-pacer-btn ${showSettings ? 'active' : ''}`}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings size={20} />
                </button>

                {showSettings && (
                    <div className="pacer-settings">
                        <h3>Choose Pattern</h3>
                        <div className="pattern-grid">
                            {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                                <button
                                    key={key}
                                    className={`pattern-option ${selectedPattern === key ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedPattern(key);
                                        setShowSettings(false);
                                    }}
                                    style={{ '--pattern-color': p.color }}
                                >
                                    <div className="pattern-name">{p.name}</div>
                                    <div className="pattern-desc">{p.description}</div>
                                    <div className="pattern-timing">
                                        {p.timings.join('-')}s
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pacer-content">
                    {/* Pattern name at top */}
                    <div className="pacer-title">
                        <Wind size={24} />
                        <span>{pattern.name}</span>
                    </div>

                    {/* Description below title */}
                    <div className="pacer-instruction">
                        {pattern.description}
                    </div>

                    {/* Circle in middle - no text inside, just visual */}
                    <div
                        className={`breathing-circle animate-${selectedPattern}`}
                        style={{
                            '--pattern-color': pattern.color,
                            '--phase-duration': `${pattern.timings[phaseIndex]}s`
                        }}
                    >
                        {/* Empty - just the animated circle */}
                    </div>

                    {/* Current phase text below circle */}
                    <div className="current-phase-text">
                        {text}
                    </div>

                    {/* Timer below phase text */}
                    <div className="phase-timer-display">
                        {pattern.timings[phaseIndex]}s
                    </div>

                    {/* Phase indicators at bottom */}
                    <div className="phase-indicators">
                        {pattern.phases.map((phase, idx) => (
                            <div
                                key={idx}
                                className={`phase-dot ${idx === phaseIndex ? 'active' : ''}`}
                                style={{ '--pattern-color': pattern.color }}
                            >
                                <span>{phase}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
