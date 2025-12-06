import { useState, useEffect } from 'react';
import { X, Wind, Settings } from 'lucide-react';
import './BreathingPacer.css';

const BREATHING_PATTERNS = {
    box: {
        name: 'Box Breathing',
        description: 'Equal timing for calm & focus',
        phases: ['Inhale', 'Hold', 'Exhale', 'Hold'],
        timings: [4, 4, 4, 4],
        color: '#8b5cf6'
    },
    '478': {
        name: '4-7-8 Technique',
        description: 'Dr. Weil\'s relaxation method',
        phases: ['Inhale', 'Hold', 'Exhale'],
        timings: [4, 7, 8],
        color: '#06b6d4'
    },
    wimhof: {
        name: 'Wim Hof',
        description: 'Power breathing for energy',
        phases: ['Inhale', 'Exhale', 'Hold'],
        timings: [2, 1, 15],
        color: '#ef4444'
    },
    coherent: {
        name: 'Coherent Breathing',
        description: 'Heart-rate variability',
        phases: ['Inhale', 'Exhale'],
        timings: [5, 5],
        color: '#10b981'
    },
    energizing: {
        name: 'Energizing Breath',
        description: 'Quick energy boost',
        phases: ['Inhale', 'Hold', 'Exhale'],
        timings: [3, 3, 6],
        color: '#f59e0b'
    }
};

export function BreathingPacer({ onClose }) {
    const [selectedPattern, setSelectedPattern] = useState('box');
    const [text, setText] = useState('Inhale');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    const pattern = BREATHING_PATTERNS[selectedPattern];

    useEffect(() => {
        const phases = pattern.phases;
        const timings = pattern.timings;
        let step = 0;
        let timeoutId;

        const startCycle = () => {
            // Initial Set
            setText(phases[0]);
            setPhaseIndex(0);
            step = 0;
            timeoutId = setTimeout(runCycle, timings[0] * 1000);
        };

        const runCycle = () => {
            step = (step + 1) % phases.length;
            setText(phases[step]);
            setPhaseIndex(step);

            // Schedule next phase
            timeoutId = setTimeout(runCycle, timings[step] * 1000);
        };

        startCycle(); // Start the first cycle

        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedPattern, pattern]); // Added pattern to dependencies to ensure it's up-to-date

    return (
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
                    <div className="pacer-title">
                        <Wind size={24} />
                        <span>{pattern.name}</span>
                    </div>

                    <div
                        className={`breathing-circle animate-${selectedPattern}`}
                        style={{
                            '--pattern-color': pattern.color,
                            '--phase-duration': `${pattern.timings[phaseIndex]}s`
                        }}
                    >
                        <div className="inner-text">{text}</div>
                        <div className="phase-timer">
                            {pattern.timings[phaseIndex]}s
                        </div>
                    </div>

                    <div className="pacer-instruction">
                        {pattern.description}
                    </div>

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
        </div>
    );
}
