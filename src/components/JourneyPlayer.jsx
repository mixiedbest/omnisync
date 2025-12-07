import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, Clock } from 'lucide-react';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import './JourneyPlayer.css';

export function JourneyPlayer({ journey, onBack }) {
    const [duration, setDuration] = useState('short'); // 'short' or 'long'
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [customPhaseDurations, setCustomPhaseDurations] = useState({});
    const [pausedAt, setPausedAt] = useState(0); // Track elapsed time when paused

    const { play, stop } = useBinauralBeat();
    const phaseTimerRef = useRef(null);
    const progressTimerRef = useRef(null);

    const phases = journey[duration].phases;
    const totalDuration = journey[duration].duration;
    const currentPhase = phases[currentPhaseIndex];
    const isLastPhase = currentPhaseIndex === phases.length - 1;

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            stop();
        };
    }, [stop]);

    const startPhase = (phaseIndex, resumeFrom = 0) => {
        const phase = phases[phaseIndex];
        console.log(`[Journey] Starting phase ${phaseIndex}: ${phase.name}, resumeFrom: ${resumeFrom}s, duration: ${phase.duration}s`);

        // Play the phase audio
        play(
            phase.freq || 0,
            (phase.freq || 0) + (phase.bothEars || 0),
            phase.bothEars || 0,
            phase.noiseType || null,
            phase.soundscapeType || null,
            {
                binaural: 0.7,
                bothEars: 0.5,
                noise: 0.3,
                soundscape: 0.4
            }
        );

        setCurrentPhaseIndex(phaseIndex);
        setIsPlaying(true);
        setHasStarted(true);

        // Reset progress if starting fresh (not resuming)
        if (resumeFrom === 0) {
            setPhaseProgress(0);
            setElapsedTime(0);
        }

        // Use custom duration if set, otherwise use default
        const phaseDuration = customPhaseDurations[phaseIndex] || phase.duration;
        const remainingDuration = phaseDuration - resumeFrom;

        console.log(`[Journey] Phase duration: ${phaseDuration}s, remaining: ${remainingDuration}s`);

        // Progress tracker
        const startTime = Date.now() - (resumeFrom * 1000);
        progressTimerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min((elapsed / phaseDuration) * 100, 100);
            setPhaseProgress(progress);
            setElapsedTime(Math.floor(elapsed));
        }, 100);

        // Auto-advance to next phase
        phaseTimerRef.current = setTimeout(() => {
            console.log(`[Journey] Phase ${phaseIndex} complete, advancing...`);
            if (phaseIndex < phases.length - 1) {
                setPausedAt(0); // Reset pause tracker
                nextPhase();
            } else {
                // Journey complete
                console.log('[Journey] All phases complete');
                endJourney();
            }
        }, remainingDuration * 1000);
    };

    const nextPhase = () => {
        console.log(`[Journey] nextPhase called, current: ${currentPhaseIndex}, next: ${currentPhaseIndex + 1}`);
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);

        if (currentPhaseIndex < phases.length - 1) {
            startPhase(currentPhaseIndex + 1);
        }
    };

    const endJourney = () => {
        if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        stop();
        setIsPlaying(false);
        setPausedAt(0);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            // Pause
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            stop();
            setIsPlaying(false);
            setPausedAt(elapsedTime); // Save current elapsed time
        } else {
            // Resume or start
            if (hasStarted) {
                // Resume from where we paused
                startPhase(currentPhaseIndex, pausedAt);
            } else {
                // Start fresh
                startPhase(currentPhaseIndex);
            }
        }
    };

    const handleDurationChange = (newDuration) => {
        if (isPlaying) {
            endJourney();
        }
        setDuration(newDuration);
        setCurrentPhaseIndex(0);
        setPhaseProgress(0);
        setElapsedTime(0);
        setHasStarted(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="journey-player">
            <div className="page-header">
                <button className="back-button" onClick={() => { endJourney(); onBack(); }}>
                    <ArrowLeft size={20} />
                    Back to Journeys
                </button>
            </div>

            <div className="player-container">
                <div className="journey-header">
                    <h1 className="journey-title-large">{journey.title}</h1>
                    <p className="journey-subtitle">{journey.description}</p>
                </div>

                {/* Duration Selector */}
                {!hasStarted && (
                    <>
                        <div className="duration-selector">
                            <div className="duration-label">
                                <Clock size={18} />
                                Choose Duration
                            </div>
                            <div className="duration-options">
                                <button
                                    className={`duration-option ${duration === 'short' ? 'selected' : ''}`}
                                    onClick={() => handleDurationChange('short')}
                                >
                                    <div className="duration-time">{formatTime(journey.short.duration)}</div>
                                    <div className="duration-desc">Quick Session</div>
                                </button>
                                <button
                                    className={`duration-option ${duration === 'long' ? 'selected' : ''}`}
                                    onClick={() => handleDurationChange('long')}
                                >
                                    <div className="duration-time">{formatTime(journey.long.duration)}</div>
                                    <div className="duration-desc">Deep Dive</div>
                                </button>
                            </div>
                        </div>

                        {/* Custom Phase Duration Selectors */}
                        {phases.map((phase, index) => phase.customizable && (
                            <div key={index} className="custom-phase-duration">
                                <div className="custom-phase-label">
                                    {phase.name} Duration
                                </div>
                                <div className="custom-duration-options">
                                    {phase.durationOptions.map((dur) => (
                                        <button
                                            key={dur}
                                            className={`custom-duration-btn ${(customPhaseDurations[index] || phase.duration) === dur ? 'selected' : ''}`}
                                            onClick={() => setCustomPhaseDurations({ ...customPhaseDurations, [index]: dur })}
                                        >
                                            {formatTime(dur)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Current Phase Display */}
                <div className="current-phase-card">
                    <div className="phase-number">
                        Phase {currentPhaseIndex + 1} of {phases.length}
                        {currentPhase.loopable && <span className="loop-indicator"> ∞ Looping</span>}
                    </div>
                    <h2 className="phase-name">{currentPhase.name}</h2>
                    <p className="phase-desc">
                        {currentPhase.desc}
                        {currentPhase.loopable && <span className="loop-hint"> (Will repeat until you advance)</span>}
                    </p>

                    {/* Progress Bar */}
                    <div className="phase-progress-bar">
                        <div className="phase-progress-fill" style={{ width: `${phaseProgress}%` }}></div>
                    </div>

                    <div className="phase-time">
                        {formatTime(elapsedTime)} / {formatTime(currentPhase.duration)}
                    </div>

                    {/* Debug Info */}
                    <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'monospace'
                    }}>
                        <div>Progress: {phaseProgress.toFixed(1)}%</div>
                        <div>Elapsed: {elapsedTime}s</div>
                        <div>Phase Index: {currentPhaseIndex}</div>
                        <div>Timer Active: {progressTimerRef.current ? 'YES' : 'NO'}</div>
                        <div>Playing: {isPlaying ? 'YES' : 'NO'}</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="player-controls-journey">
                    <button
                        className={`play-pause-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <Pause size={40} /> : <Play size={40} />}
                    </button>

                    {!isLastPhase && (
                        <button
                            className="skip-btn"
                            onClick={nextPhase}
                            disabled={!isPlaying}
                        >
                            <SkipForward size={24} />
                            <span>Next Phase</span>
                        </button>
                    )}
                </div>

                {/* Phase Timeline */}
                <div className="phase-timeline">
                    {phases.map((phase, index) => (
                        <div
                            key={index}
                            className={`timeline-item ${index === currentPhaseIndex ? 'active' : ''} ${index < currentPhaseIndex ? 'completed' : ''}`}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-label">{phase.name}</div>
                            <div className="timeline-duration">{formatTime(phase.duration)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
