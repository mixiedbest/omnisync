import { useState } from 'react';
import { Play, Pause, Volume2, Wind, Timer, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, List } from 'lucide-react';
import { BreathingPacer } from './BreathingPacer';
import './PlayerControls.css';

export function PlayerControls({
    isPlaying,
    onPlayPause,
    volume,
    onVolumeChange,
    currentTrack,
    sleepTimer = null,
    onSetSleepTimer = () => { },
    // Playlist props
    currentPlaylist = null,
    currentTrackIndex = 0,
    playlistMode = 'normal',
    onNextTrack = () => { },
    onPreviousTrack = () => { },
    onTogglePlaylistMode = () => { }
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

    const getModeIcon = () => {
        switch (playlistMode) {
            case 'shuffle': return <Shuffle size={18} />;
            case 'repeat-one': return <Repeat1 size={18} />;
            case 'repeat-all': return <Repeat size={18} />;
            default: return <List size={18} />;
        }
    };

    return (
        <>
            {showPacer && <BreathingPacer onClose={() => setShowPacer(false)} />}

            <div className="player-controls glass-card">
                <div className="player-info">
                    {currentTrack ? (
                        <>
                            <div className="track-title">
                                {currentTrack.title}
                                {currentPlaylist && (
                                    <span className="playlist-indicator">
                                        <List size={14} />
                                        {currentPlaylist.name}
                                    </span>
                                )}
                            </div>
                            <div className="track-details">
                                {currentTrack.beat} Hz beat • {currentTrack.left}/{currentTrack.right} Hz
                                {currentPlaylist && (
                                    <span className="track-position">
                                        • Track {currentTrackIndex + 1}/{currentPlaylist.tracks?.length || 0}
                                    </span>
                                )}
                                {sleepTimer && <span className="timer-badge"> • 🌙 {sleepTimer}m</span>}
                            </div>
                        </>
                    ) : (
                        <div className="track-title">Select a frequency to begin</div>
                    )}
                </div>

                <div className="player-actions">
                    {currentPlaylist && (
                        <>
                            <button
                                className="action-btn"
                                onClick={onPreviousTrack}
                                disabled={!isPlaying}
                                title="Previous Track"
                            >
                                <SkipBack size={20} />
                            </button>
                            <button
                                className={`action-btn ${playlistMode !== 'normal' ? 'active' : ''}`}
                                onClick={onTogglePlaylistMode}
                                title={`Mode: ${playlistMode}`}
                            >
                                {getModeIcon()}
                            </button>
                        </>
                    )}

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

                    {currentPlaylist && (
                        <button
                            className="action-btn"
                            onClick={onNextTrack}
                            disabled={!isPlaying}
                            title="Next Track"
                        >
                            <SkipForward size={20} />
                        </button>
                    )}

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
