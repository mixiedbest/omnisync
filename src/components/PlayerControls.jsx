import { Play, Pause, Volume2 } from 'lucide-react';
import './PlayerControls.css';

export function PlayerControls({
    isPlaying,
    onPlayPause,
    volume,
    onVolumeChange,
    currentTrack
}) {
    return (
        <div className="player-controls glass-card">
            <div className="player-info">
                {currentTrack ? (
                    <>
                        <div className="track-title">{currentTrack.title}</div>
                        <div className="track-details">
                            {currentTrack.beat} Hz beat • {currentTrack.left}/{currentTrack.right} Hz
                        </div>
                    </>
                ) : (
                    <div className="track-title">Select a frequency to begin</div>
                )}
            </div>

            <div className="player-actions">
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

            {isPlaying && (
                <div className="breathing-indicator">
                    <div className="pulse-circle"></div>
                </div>
            )}
        </div>
    );
}
