import { useState, useEffect, useRef } from 'react';
import './BreathSync.css';

export function BreathSync({ breathPattern, isActive = true, onBreathCycle }) {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
    const [progress, setProgress] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const onBreathCycleRef = useRef(onBreathCycle);

    const { inhale = 4, hold = 2, exhale = 6 } = breathPattern || {};

    // Update ref when callback changes
    useEffect(() => {
        onBreathCycleRef.current = onBreathCycle;
    }, [onBreathCycle]);

    useEffect(() => {
        if (!isActive) return;

        let currentPhase = 'inhale';
        let phaseStartTime = Date.now();

        const getDuration = (p) => {
            if (p === 'inhale') return inhale * 1000;
            if (p === 'hold') return hold * 1000;
            if (p === 'exhale') return exhale * 1000;
            return 0;
        };

        const animate = () => {
            const now = Date.now();
            const elapsed = now - phaseStartTime;
            const duration = getDuration(currentPhase);
            const phaseProgress = Math.min(elapsed / duration, 1);

            setProgress(phaseProgress);
            setPhase(currentPhase);

            if (phaseProgress >= 1) {
                // Move to next phase
                if (currentPhase === 'inhale') {
                    currentPhase = hold > 0 ? 'hold' : 'exhale';
                } else if (currentPhase === 'hold') {
                    currentPhase = 'exhale';
                } else {
                    currentPhase = 'inhale';
                    setCycleCount(c => {
                        const newCount = c + 1;
                        if (onBreathCycleRef.current) onBreathCycleRef.current(newCount);
                        return newCount;
                    });
                }
                phaseStartTime = now;
                setProgress(0);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        let animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive, inhale, hold, exhale]); // Removed onBreathCycle from dependencies

    const getCircleScale = () => {
        if (phase === 'inhale') {
            return 0.5 + (progress * 0.5); // 0.5 to 1.0
        } else if (phase === 'hold') {
            return 1.0; // Stay at max
        } else {
            return 1.0 - (progress * 0.5); // 1.0 to 0.5
        }
    };

    const getPhaseText = () => {
        if (phase === 'inhale') return 'Breathe In';
        if (phase === 'hold') return 'Hold';
        return 'Breathe Out';
    };

    const getPhaseColor = () => {
        if (phase === 'inhale') return '#3b82f6'; // Blue
        if (phase === 'hold') return '#eab308'; // Gold
        return '#8b5cf6'; // Purple
    };

    if (!isActive) return null;

    return (
        <div className="breath-sync-overlay">
            <div className="breath-container">
                <div
                    className="breath-circle"
                    style={{
                        transform: `scale(${getCircleScale()})`,
                        borderColor: getPhaseColor(),
                        boxShadow: `0 0 ${40 + progress * 40}px ${getPhaseColor()}`
                    }}
                >
                    <div className="breath-inner-circle" style={{ background: getPhaseColor() }}></div>
                </div>

                <div className="breath-text">
                    <div className="breath-phase">{getPhaseText()}</div>
                    <div className="breath-count">{Math.ceil((1 - progress) * (phase === 'inhale' ? inhale : phase === 'hold' ? hold : exhale))}</div>
                </div>

                {/* Ripple effect */}
                <div className="breath-ripples">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="ripple"
                            style={{
                                animationDelay: `${i * 0.6}s`,
                                borderColor: getPhaseColor()
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Cycle counter */}
            <div className="breath-stats">
                <div className="stat-item">
                    <span className="stat-label">Breath Cycles</span>
                    <span className="stat-value">{cycleCount}</span>
                </div>
            </div>
        </div>
    );
}
