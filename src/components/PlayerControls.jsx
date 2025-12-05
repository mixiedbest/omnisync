import { useState } from 'react';
import { Play, Pause, Volume2, Wind, Timer } from 'lucide-react';
import { BreathingPacer } from './BreathingPacer';
import './PlayerControls.css';

export function PlayerControls({
    isPlaying,
    onPlayPause,
    volume,
    onVolumeChange,
    currentTrack,
    sleepTimer,
    onSetSleepTimer
}) {
    const [showPacer, setShowPacer] = useState(false);

    const toggleSleepTimer = () => {
        if (!sleepTimer) onSetSleepTimer(15);
        else if (sleepTimer === 15) onSetSleepTimer(30);
        else if (sleepTimer === 30) onSetSleepTimer(60);
        else if (sleepTimer === 60) onSetSleepTimer(90);
        else if (sleepTimer === 90) onSetSleepTimer(120);
        else onSetSleepTimer(null);
    };

    return (
        <>
            {showPacer && <BreathingPacer onClose={() => setShowPacer(false)} />}

            <div className="player-controls glass-card">
                <div className="player-info">
                    {currentTrack ? (
                        <>
                            <div className="track-title">{currentTrack.title}</div>
                            <div className="track-details">
                                {currentTrack.beat} Hz beat • {currentTrack.left}/{currentTrack.right} Hz
                                {sleepTimer && <span className="timer-badge"> • 🌙 {sleepTimer}m</span>}
                            </div>
                        </>
                    ) : (
                        <div className="track-title">Select a frequency to begin</div>
                    )}
                </div>

                <div className="player-actions">
                    <button
                        className={`action-btn ${showPacer ? 'active' : ''}`}
                        onClick={() => setShowPacer(!showPacer)}
                        title="Breathing Pacer"
                    >
                        <Wind size={20} />
                    </button>

                    <button
                        className={`action-btn ${sleepTimer ? 'active' : ''}`}
                        onClick={toggleSleepTimer}
                        title={`Sleep Timer: ${sleepTimer ? sleepTimer + 'm' : 'Off'}`}
                    >
                        <Timer size={20} />
                        {sleepTimer && <span className="timer-value">{sleepTimer}</span>}
                    </button>

                    <button
                        className="play-btn"
                        onClick={onPlayPause}
                        disabled={!currentTrack}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    <div className="volume-control">
                        <Volume2 size={20} />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="volume-slider"
                        />
                        <span className="volume-value">{Math.round(volume * 100)}%</span>
                    </div>
                </div>
            </div>
        </>
    );
}
