import { useState, useEffect } from 'react';
import { ArrowLeft, Music, Plus, Play, MoreVertical, Users, Heart, Share2, Trash2, Edit2, Lock } from 'lucide-react';
import './PlaylistsPage.css';

export function PlaylistsPage({ onBack, onPlayPlaylist }) {
    const [playlists, setPlaylists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistMood, setNewPlaylistMood] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [activePlaylist, setActivePlaylist] = useState(null);

    useEffect(() => {
        const savedPlaylists = localStorage.getItem('omnisync_playlists');
        if (savedPlaylists) {
            setPlaylists(JSON.parse(savedPlaylists));
        }
    }, []);

    const savePlaylists = (updatedPlaylists) => {
        localStorage.setItem('omnisync_playlists', JSON.stringify(updatedPlaylists));
        setPlaylists(updatedPlaylists);
    };

    const handleCreatePlaylist = () => {
        if (!newPlaylistName.trim()) return;

        const newPlaylist = {
            id: Date.now(),
            name: newPlaylistName,
            mood: newPlaylistMood,
            isPublic: isPublic,
            tracks: [],
            collaborators: [],
            creator: 'You',
            createdAt: new Date().toISOString(),
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };

        savePlaylists([...playlists, newPlaylist]);
        setShowCreateModal(false);
        setNewPlaylistName('');
        setNewPlaylistMood('');
        setIsPublic(false);
    };

    const handleDeletePlaylist = (id) => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            savePlaylists(playlists.filter(p => p.id !== id));
            if (activePlaylist?.id === id) setActivePlaylist(null);
        }
    };

    return (
        <div className="playlists-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="playlists-header">
                <h1>
                    <Music size={32} />
                    Your Playlists
                </h1>
                <p>Curate your sonic journeys</p>
            </div>

            <div className="playlists-content">
                {/* Playlist Grid */}
                <div className="playlists-grid">
                    <button
                        className="create-playlist-card"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <div className="create-icon">
                            <Plus size={32} />
                        </div>
                        <span>Create New Playlist</span>
                    </button>

                    {playlists.map(playlist => (
                        <div
                            key={playlist.id}
                            className={`playlist-card ${activePlaylist?.id === playlist.id ? 'active' : ''}`}
                            onClick={() => setActivePlaylist(playlist)}
                            style={{ '--playlist-color': playlist.color }}
                        >
                            <div className="playlist-cover">
                                <Music size={32} />
                            </div>
                            <div className="playlist-info">
                                <h3>{playlist.name}</h3>
                                <p className="playlist-meta">
                                    {playlist.tracks.length} tracks • {playlist.mood || 'No mood set'}
                                </p>
                                <div className="playlist-badges">
                                    {playlist.isPublic && (
                                        <span className="badge public" title="Public Playlist">
                                            <Share2 size={10} /> Public
                                        </span>
                                    )}
                                    {playlist.collaborators.length > 0 && (
                                        <span className="badge collaborators">
                                            <Users size={10} /> {playlist.collaborators.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="playlist-play-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlayPlaylist(playlist);
                                }}
                            >
                                <Play size={20} fill="currentColor" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Active Playlist Details */}
                {activePlaylist && (
                    <div className="playlist-details-panel">
                        <div className="panel-header">
                            <div className="panel-title">
                                <h2>{activePlaylist.name}</h2>
                                <div className="tags-row">
                                    <span className="mood-tag">{activePlaylist.mood}</span>
                                    {activePlaylist.isPublic && <span className="mood-tag public">Public</span>}
                                </div>
                            </div>
                            <div className="panel-actions">
                                <button className="action-btn" title="Add Collaborator">
                                    <Users size={18} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => handleDeletePlaylist(activePlaylist.id)}
                                    title="Delete Playlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="tracks-list">
                            {activePlaylist.tracks.length === 0 ? (
                                <div className="empty-tracks">
                                    <Music size={48} />
                                    <p>No tracks yet</p>
                                    <p className="empty-subtitle">Add sounds from the Generator or other pages</p>
                                </div>
                            ) : (
                                activePlaylist.tracks.map((track, index) => (
                                    <div key={index} className="track-item">
                                        <div className="track-info">
                                            <span className="track-name">{track.title}</span>
                                            <span className="track-details">{track.duration} • {track.type}</span>
                                        </div>
                                        <button className="track-play-btn">
                                            <Play size={16} fill="currentColor" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Playlist</h3>
                        <input
                            type="text"
                            className="modal-input"
                            placeholder="Playlist Name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="text"
                            className="modal-input"
                            placeholder="Mood (e.g., Focus, Sleep, Energy)"
                            value={newPlaylistMood}
                            onChange={(e) => setNewPlaylistMood(e.target.value)}
                        />

                        <label className="privacy-toggle">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span className="toggle-label">
                                {isPublic ? <Share2 size={16} /> : <Lock size={16} />}
                                {isPublic ? 'Public (Visible to Connections)' : 'Private (Only You)'}
                            </span>
                        </label>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={handleCreatePlaylist}
                                disabled={!newPlaylistName.trim()}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
