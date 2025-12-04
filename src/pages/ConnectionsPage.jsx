import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Sparkles, Heart, Zap, Link2 } from 'lucide-react';
import './ConnectionsPage.css';

export function ConnectionsPage({ onBack }) {
    const [username, setUsername] = useState('');
    const [connections, setConnections] = useState([]);
    const [showAddConnection, setShowAddConnection] = useState(false);
    const [newConnectionName, setNewConnectionName] = useState('');
    const [showSparkAnimation, setShowSparkAnimation] = useState(false);
    const [sparkMessage, setSparkMessage] = useState('');

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
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
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

    const generateMandala = (connection) => {
        // Generate a unique mandala pattern based on connection
        const numPoints = 6 + (connection.mutualConnections?.length || 0);
        return numPoints;
    };

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
                        {connections.reduce((acc, c) => acc + (c.mutualConnections?.length || 0), 0)}
                    </div>
                    <div className="stat-label">Mutual Links</div>
                </div>
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
                                <div className="connection-name">{connection.name}</div>
                                <div className="connection-meta">
                                    <span className="connection-date">
                                        Connected {new Date(connection.connectedAt).toLocaleDateString()}
                                    </span>
                                    {connection.mutualConnections && connection.mutualConnections.length > 0 && (
                                        <span className="mutual-count">
                                            <Users size={12} />
                                            {connection.mutualConnections.length} mutual
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="remove-connection-btn"
                                onClick={() => removeConnection(connection.id)}
                                title="Remove connection"
                            >
                                ×
                            </button>
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
