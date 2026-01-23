import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Wind, Settings } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';
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

    coherent: {
        name: 'Coherent (5-5)',
        description: 'Balance & HRV (5s / 5s)',
        phases: ['Inhale', 'Exhale'],
        timings: [5, 5],
        color: '#ec4899'
    },
    '7-11': {
        name: '7-11 Deep Calm',
        description: 'Anti-anxiety (7s / 11s)',
        phases: ['Inhale', 'Exhale'],
        timings: [7, 11],
        color: '#14b8a6'
    },
    vortex: {
        name: 'Vortex (Fibonacci)',
        description: 'Spiral breath (13s → 1s)',
        phases: ['Inhale', 'Hold', 'Exhale', 'Hold'],
        timings: [13, 0, 13, 0],
        color: '#8b5cf6'
    }
};

export function BreathingPacer({ onClose, pattern: initialPattern = 'box' }) {
    const [selectedPattern, setSelectedPattern] = useState(initialPattern);
    const [text, setText] = useState('Inhale');
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    // Haptics
    const { pulse, pattern: triggerPattern } = useHaptics();

    // Vortex State
    const [vortexStage, setVortexStage] = useState(0);
    const fibSequence = [13, 8, 5, 3, 2, 1]; // Descending vortex

    const pattern = BREATHING_PATTERNS[selectedPattern];

    // Update pattern when prop changes (for journey phase transitions)
    useEffect(() => {
        setSelectedPattern(initialPattern);
        if (initialPattern === 'vortex') {
            setVortexStage(0);
        }
    }, [initialPattern]);

    // Timer logic
    useEffect(() => {
        let timeoutId;
        let currentPhaseIndex = 0;
        let currentVortexStage = 0; // Local ref probably not needed if relying on state, but let's be safe

        // We need to access the LATEST vortexStage from state in the interval if we use functional updates, 
        // OR simpler: we rely on the dependency array to restart the effect when vortexStage changes.
        // The latter is cleaner.

        const runPhase = () => {
            // Re-capture pattern here? No, pattern is from outer scope
            const phase = pattern.phases[currentPhaseIndex];

            // Determine duration (Static vs Vortex)
            let duration = pattern.timings[currentPhaseIndex];

            if (selectedPattern === 'vortex') {
                const fibNum = fibSequence[vortexStage];
                // Simplify: Inhale/Exhale = fib sequence number
                if (duration > 0) {
                    duration = fibNum;
                }
            }

            // Haptic Feedback
            if (phase === 'Inhale') triggerPattern([duration * 25, 200, 50]); // Rising buzz
            if (phase === 'Exhale') pulse(duration * 100); // Continuous calm buzz
            if (phase === 'Hold') pulse(50); // Short blip

            setText(phase);
            setPhaseIndex(currentPhaseIndex);

            timeoutId = setTimeout(() => {
                const nextPhase = (currentPhaseIndex + 1) % pattern.phases.length;

                // Vortex Logic: Advance stage after a full cycle (Inhale -> Hold -> Exhale -> Hold)
                if (selectedPattern === 'vortex' && nextPhase === 0) {
                    setVortexStage(prev => {
                        if (prev < fibSequence.length - 1) return prev + 1;
                        return 0; // Loop or stay at 1? Let's loop.
                    });
                }

                currentPhaseIndex = nextPhase;
                runPhase();
            }, duration * 1000);
        };

        runPhase();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedPattern, pattern, vortexStage]); // Restart effect when stage changes to pick up new timing

    // Manual Positioning & Scroll Lock
    useEffect(() => {
        // 1. Lock Body Scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        // 2. Cleanup
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Color Logic
    const getCircleStyle = () => {
        const duration = selectedPattern === 'vortex'
            ? (pattern.timings[phaseIndex] > 0 ? fibSequence[vortexStage] : 0) // Use current fib num
            : pattern.timings[phaseIndex];

        const scale = text === 'Inhale' ? 1.5 : text === 'Exhale' ? 0.8 : 1.1;

        return {
            transition: `transform ${duration}s ease-in-out, background-color 0.5s`,
            transform: `scale(${scale})`,
            backgroundColor: pattern.color,
            boxShadow: `0 0 ${scale * 30}px ${pattern.color}66`
        };
    };

    return createPortal(
        <div className="breathing-overlay">
            <div className="pacer-header">
                <button
                    className="settings-pacer-btn"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings size={24} />
                </button>
                <div className="header-spacer"></div>
                <button className="close-pacer-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            {showSettings && (
                <div className="pacer-settings">
                    <h3>Breathing Pattern</h3>
                    <div className="pattern-grid">
                        {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                            <button
                                key={key}
                                className={`pattern-option ${selectedPattern === key ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedPattern(key);
                                    setShowSettings(false);
                                }}
                                style={{
                                    borderColor: selectedPattern === key ? p.color : 'transparent',
                                    color: selectedPattern === key ? p.color : '#fff'
                                }}
                            >
                                <span className="pattern-name">{p.name}</span>
                                <span className="pattern-desc">{p.description}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="pacer-content">
                <div
                    className="breathing-circle"
                    style={getCircleStyle()}
                >
                    <div className="circle-content">
                        <span className="breath-instruction">{text}</span>
                        {selectedPattern === 'vortex' && (
                            <span className="vortex-stage" style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                                {fibSequence[vortexStage]}s
                            </span>
                        )}
                    </div>
                </div>

                <div className="pacer-controls">
                    <h2 style={{ color: pattern.color }}>{pattern.name}</h2>
                    <p>{pattern.description}</p>
                </div>
            </div>
        </div>,
        document.body
    );
}
