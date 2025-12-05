import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Sparkles, Heart, Zap, Link2, Activity, MessageCircle, Award, Gift, Music } from 'lucide-react';
import './ConnectionsPage.css';

import { GiftsAndMessagesPage } from './GiftsAndMessagesPage';

export function ConnectionsPage({ onBack }) {
    const [view, setView] = useState('list'); // 'list' or 'gifts'
    const [username, setUsername] = useState('');
    const [connections, setConnections] = useState([]);
    const [showAddConnection, setShowAddConnection] = useState(false);
    const [newConnectionName, setNewConnectionName] = useState('');
    const [showSparkAnimation, setShowSparkAnimation] = useState(false);
    const [sparkMessage, setSparkMessage] = useState('');
    const [milestonePopup, setMilestonePopup] = useState(null);

    const sparkMessages = [
        "Better Together ✨",
        "Connection Creates Expansion 🌟",
        "Alignment Unlocked 🔓",
        "Your Sync Strengthens the Circle 💫",
        "Connection Nurtures the Heart 💜",
        "Harmony Amplified 🎵",
        "Energy Multiplied ⚡",
        "Resonance Achieved 🌊",
        "Souls Aligned 🌙",
        "Frequency Match Found 🎯"
    ];

    useEffect(() => {
        const savedUsername = localStorage.getItem('omnisync_username');
        if (savedUsername) {
            setUsername(savedUsername);
        }

        const savedConnections = localStorage.getItem('omnisync_connections');
        if (savedConnections) {
            setConnections(JSON.parse(savedConnections));
        }
    }, []);

    const saveConnections = (newConnections) => {
        localStorage.setItem('omnisync_connections', JSON.stringify(newConnections));
        setConnections(newConnections);
    };

    const handleAddConnection = () => {
        if (!newConnectionName.trim()) return;

        const newConnection = {
            id: Date.now(),
            name: newConnectionName.trim(),
            connectedAt: new Date().toISOString(),
            mutualConnections: [], // Will be populated when backend is added
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            sessionsSynced: 0
        };

        const updatedConnections = [...connections, newConnection];
        saveConnections(updatedConnections);

        // Show spark animation
        const randomMessage = sparkMessages[Math.floor(Math.random() * sparkMessages.length)];
        setSparkMessage(randomMessage);
        setShowSparkAnimation(true);

        setTimeout(() => {
            setShowSparkAnimation(false);
            setShowAddConnection(false);
            setNewConnectionName('');
        }, 2500);
    };

    const removeConnection = (id) => {
        const updatedConnections = connections.filter(c => c.id !== id);
        saveConnections(updatedConnections);
    };

    const handleSyncSession = (id) => {
        const updatedConnections = connections.map(conn => {
            if (conn.id === id) {
                const newCount = (conn.sessionsSynced || 0) + 1;

                // Check for milestones
                if (newCount === 5) triggerMilestone("Harmony Unlocked 🎵");
                if (newCount === 10) triggerMilestone("Radiant Connection ✨");
                if (newCount === 20) triggerMilestone("Cosmic Union 🌟");

                return { ...conn, sessionsSynced: newCount };
            }
            return conn;
        });
        saveConnections(updatedConnections);
    };

    const triggerMilestone = (message) => {
        setMilestonePopup(message);
        setTimeout(() => setMilestonePopup(null), 3000);
    };

    const generateMandala = (connection) => {
        // Generate a unique mandala pattern based on connection
        const numPoints = 6 + (connection.mutualConnections?.length || 0);
        return numPoints;
    };

    if (view === 'gifts') {
        return <GiftsAndMessagesPage onBack={() => setView('list')} />;
    }

    if (view === 'playlists') {
        return (
            <div className="connections-page">
                <button className="back-button" onClick={() => setView('list')}>
                    <ArrowLeft size={20} />
                    Back to Connections
                </button>
                <div className="connections-header">
                    <h1 className="page-title">
                        <Music size={32} />
                        Shared Playlists
                    </h1>
                    <p className="page-subtitle">Discover sounds from your circle</p>
                </div>

                <div className="connections-list">
                    {connections.length === 0 ? (
                        <div className="empty-connections">
                            <Music size={48} />
                            <p>No connections yet.</p>
                            <p className="empty-subtitle">Connect with others to see their public playlists.</p>
                        </div>
                    ) : (
                        <div className="shared-playlists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                            {/* Mock Data for demonstration */}
                            <div className="connection-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div className="connection-header-row" style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div className="connection-name">Cosmic Vibes</div>
                                    <span className="badge public" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Public</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px' }}>by {connections[0]?.name || 'Unknown'}</p>
                                <div className="connection-meta">
                                    <span className="sync-count"><Music size={12} /> 8 Tracks</span>
                                    <span className="sync-count"><Activity size={12} /> Focus</span>
                                </div>
                            </div>
                            <div className="connection-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div className="connection-header-row" style={{ width: '100%', justifyContent: 'space-between' }}>
                                    <div className="connection-name">Sleepy Time</div>
                                    <span className="badge public" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Public</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 12px' }}>by {connections[0]?.name || 'Unknown'}</p>
                                <div className="connection-meta">
                                    <span className="sync-count"><Music size={12} /> 12 Tracks</span>
                                    <span className="sync-count"><Activity size={12} /> Sleep</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="connections-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="connections-header">
                <h1 className="page-title">
                    <Users size={32} />
                    Connections
                </h1>
                <p className="page-subtitle">Your Sonic Circle</p>
            </div>

            {username && (
                <div className="user-info">
                    <div className="user-avatar">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{username}</span>
                </div>
            )}

            <div className="connections-stats">
                <div className="stat-card">
                    <div className="stat-number">{connections.length}</div>
                    <div className="stat-label">Connections</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {connections.reduce((acc, c) => acc + (c.sessionsSynced || 0), 0)}
                    </div>
                    <div className="stat-label">Total Syncs</div>
                </div>
            </div>

            {/* Connection Features Grid */}
            <div className="connections-features-grid">
                <button
                    className="feature-card"
                    onClick={() => setView('gifts')}
                >
                    <div className="icon-pair">
                        <MessageCircle size={20} />
                        <Gift size={20} />
                    </div>
                    <span>Gifts & Messages</span>
                    <span className="new-badge">New</span>
                </button>
                <button className="feature-card blocked">
                    <Activity size={24} className="feature-icon" />
                    <span>Shared Waveform</span>
                    <span className="coming-soon-badge">Soon</span>
                </button>
                <button className="feature-card blocked">
                    <Users size={24} className="feature-icon" />
                    <span>Group Rooms</span>
                    <span className="coming-soon-badge">Soon</span>
                </button>
                <button
                    className="feature-card"
                    onClick={() => setView('playlists')}
                >
                    <Music size={24} className="feature-icon" />
                    <span>Playlists</span>
                    <span className="new-badge">New</span>
                </button>
                <button className="feature-card blocked">
                    <Heart size={24} className="feature-icon" />
                    <span>Partner Sync</span>
                    <span className="coming-soon-badge">Soon</span>
                </button>
            </div>

            <button
                className="add-connection-btn"
                onClick={() => setShowAddConnection(true)}
            >
                <Sparkles size={20} />
                Add Connection
            </button>

            {showAddConnection && (
                <div className="add-connection-modal">
                    <div className="modal-content">
                        <h3>Connect with Someone</h3>
                        <input
                            type="text"
                            className="connection-input"
                            placeholder="Enter their username..."
                            value={newConnectionName}
                            onChange={(e) => setNewConnectionName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddConnection()}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => {
                                    setShowAddConnection(false);
                                    setNewConnectionName('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={handleAddConnection}
                                disabled={!newConnectionName.trim()}
                            >
                                <Link2 size={16} />
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSparkAnimation && (
                <div className="spark-animation">
                    <div className="spark-content">
                        <Sparkles size={64} className="spark-icon" />
                        <div className="spark-message">{sparkMessage}</div>
                    </div>
                </div>
            )}

            {milestonePopup && (
                <div className="milestone-popup">
                    <div className="milestone-content">
                        <Award size={48} className="milestone-icon" />
                        <div className="milestone-title">Milestone Reached!</div>
                        <div className="milestone-name">{milestonePopup}</div>
                    </div>
                </div>
            )}

            <div className="connections-list">
                {connections.length === 0 ? (
                    <div className="empty-connections">
                        <Heart size={48} />
                        <p>No connections yet</p>
                        <p className="empty-subtitle">Start building your sonic circle</p>
                    </div>
                ) : (
                    connections.map(connection => (
                        <div key={connection.id} className="connection-card">
                            <div className="connection-mandala" style={{ borderColor: connection.color }}>
                                <svg viewBox="0 0 100 100" className="mandala-svg">
                                    {[...Array(generateMandala(connection))].map((_, i) => {
                                        const angle = (i * 360) / generateMandala(connection);
                                        const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                                        const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                                        return (
                                            <circle
                                                key={i}
                                                cx={x}
                                                cy={y}
                                                r="8"
                                                fill={connection.color}
                                                opacity="0.6"
                                            />
                                        );
                                    })}
                                    <circle cx="50" cy="50" r="12" fill={connection.color} />
                                </svg>
                            </div>
                            <div className="connection-info">
                                <div className="connection-header-row">
                                    <div className="connection-name">{connection.name}</div>
                                    <div className="milestone-badges">
                                        {(connection.sessionsSynced >= 5) && <span title="Harmony Unlocked (5+ Syncs)">🎵</span>}
                                        {(connection.sessionsSynced >= 10) && <span title="Radiant Connection (10+ Syncs)">✨</span>}
                                        {(connection.sessionsSynced >= 20) && <span title="Cosmic Union (20+ Syncs)">🌟</span>}
                                    </div>
                                </div>
                                <div className="connection-meta">
                                    <span className="connection-date">
                                        Connected {new Date(connection.connectedAt).toLocaleDateString()}
                                    </span>
                                    <span className="sync-count">
                                        <Activity size={12} />
                                        {connection.sessionsSynced || 0} Syncs
                                    </span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="sync-btn"
                                    onClick={() => handleSyncSession(connection.id)}
                                    title="Simulate a sync session"
                                >
                                    <Zap size={16} />
                                </button>
                                <button
                                    className="remove-connection-btn"
                                    onClick={() => removeConnection(connection.id)}
                                    title="Remove connection"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {connections.length > 0 && (
                <div className="connection-circle-viz">
                    <h3 className="viz-title">Your Connection Circle</h3>
                    <div className="circle-container">
                        <div className="center-node" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-teal))' }}>
                            {username?.charAt(0).toUpperCase()}
                        </div>
                        {connections.map((connection, index) => {
                            const angle = (index * 360) / connections.length;
                            const radius = 120;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const y = Math.sin((angle * Math.PI) / 180) * radius;

                            return (
                                <div
                                    key={connection.id}
                                    className="connection-node"
                                    style={{
                                        transform: `translate(${x}px, ${y}px)`,
                                        background: connection.color
                                    }}
                                >
                                    {connection.name.charAt(0).toUpperCase()}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
