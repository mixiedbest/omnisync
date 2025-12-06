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

    const startPhase = (phaseIndex) => {
        const phase = phases[phaseIndex];

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
        setPhaseProgress(0);
        setIsPlaying(true);
        setHasStarted(true);

        // Progress tracker
        const startTime = Date.now();
        progressTimerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min((elapsed / phase.duration) * 100, 100);
            setPhaseProgress(progress);
            setElapsedTime(Math.floor(elapsed));
        }, 100);

        // Auto-advance to next phase
        phaseTimerRef.current = setTimeout(() => {
            if (phaseIndex < phases.length - 1) {
                nextPhase();
            } else {
                // Journey complete
                endJourney();
            }
        }, phase.duration * 1000);
    };

    const nextPhase = () => {
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
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            // Pause
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            stop();
            setIsPlaying(false);
        } else {
            // Resume or start
            startPhase(currentPhaseIndex);
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
                )}

                {/* Current Phase Display */}
                <div className="current-phase-card">
                    <div className="phase-number">Phase {currentPhaseIndex + 1} of {phases.length}</div>
                    <h2 className="phase-name">{currentPhase.name}</h2>
                    <p className="phase-desc">{currentPhase.desc}</p>

                    {/* Progress Bar */}
                    <div className="phase-progress-bar">
                        <div className="phase-progress-fill" style={{ width: `${phaseProgress}%` }}></div>
                    </div>

                    <div className="phase-time">
                        {formatTime(elapsedTime)} / {formatTime(currentPhase.duration)}
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
