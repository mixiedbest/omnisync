import { useState } from 'react';
import { X, Music } from 'lucide-react';
import './PlaylistSelectorModal.css';

export function PlaylistSelectorModal({ item, onClose, onSelect }) {
    const [playlists, setPlaylists] = useState(() => {
        const saved = localStorage.getItem('omnisync_playlists');
        return saved ? JSON.parse(saved) : [];
    });

    const handleSelect = (playlist) => {
        // Check if already in playlist
        if (playlist.tracks.some(t => t.id === item.id)) {
            alert(`"${item.title || item.name}" is already in "${playlist.name}"`);
            return;
        }

        // Add to playlist
        playlist.tracks.push({
            id: item.id,
            title: item.title || item.name,
            type: item.type || 'preset',
            ...item
        });

        localStorage.setItem('omnisync_playlists', JSON.stringify(playlists));
        onSelect(playlist);
        onClose();
    };

    if (playlists.length === 0) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                    <h3>No Playlists Yet</h3>
                    <p className="modal-message">Create a playlist first to add items to it!</p>
                    <button className="modal-btn confirm" onClick={onClose}>
                        Got it
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                <h3>Add to Playlist</h3>
                <p className="modal-subtitle">Choose a playlist for "{item.title || item.name}"</p>

                <div className="playlist-options">
                    {playlists.map(playlist => (
                        <button
                            key={playlist.id}
                            className="playlist-option"
                            onClick={() => handleSelect(playlist)}
                        >
                            <Music size={20} />
                            <div className="playlist-option-info">
                                <span className="playlist-option-name">{playlist.name}</span>
                                <span className="playlist-option-count">{playlist.tracks.length} tracks</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
