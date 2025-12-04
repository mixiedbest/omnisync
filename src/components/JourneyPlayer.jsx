import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipForward } from 'lucide-react';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import './JourneyPlayer.css';

export function JourneyPlayer({ journey, onBack }) {
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    const { play, stop } = useBinauralBeat();
    const phaseTimerRef = useRef(null);
    const progressTimerRef = useRef(null);

    const currentPhase = journey.phases[currentPhaseIndex];
    const isLastPhase = currentPhaseIndex === journey.phases.length - 1;

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            stop();
        };
    }, [stop]);

    const startPhase = (phaseIndex) => {
        const phase = journey.phases[phaseIndex];

        // Play the phase audio
        play(
            phase.freq || 0,
            phase.freq || 0,
            phase.bothEars || 0,
            phase.noiseType || null,
            phase.soundscapeType || null
        );

        setCurrentPhaseIndex(phaseIndex);
        setPhaseProgress(0);
        setIsPlaying(true);

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
            if (phaseIndex < journey.phases.length - 1) {
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

        if (currentPhaseIndex < journey.phases.length - 1) {
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
                    <div className="journey-emoji-large">{journey.emoji}</div>
                    <h1 className="journey-title-large">{journey.title}</h1>
                    <p className="journey-subtitle">{journey.description}</p>
                </div>

                {/* Current Phase Display */}
                <div className="current-phase-card">
                    <div className="phase-number">Phase {currentPhaseIndex + 1} of {journey.phases.length}</div>
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
                    {journey.phases.map((phase, index) => (
                        <div
                            key={index}
                            className={`timeline-item ${index === currentPhaseIndex ? 'active' : ''} ${index < currentPhaseIndex ? 'completed' : ''}`}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-label">{phase.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
