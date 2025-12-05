import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Lock, Globe, Calendar, Heart, Sparkles, Play, Settings, Eye, EyeOff, X } from 'lucide-react';
import { RoomSession } from './RoomSession';
import { PartnerSyncPage } from './PartnerSyncPage';
import './GroupRoomsPage.css';

export function GroupRoomsPage({ onBack }) {
    const [view, setView] = useState('browse'); // 'browse', 'create', 'room'
    const [rooms, setRooms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [showPartnerSync, setShowPartnerSync] = useState(false);
    const [username, setUsername] = useState('You');

    // Create Room Form State
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('private'); // 'private', 'community', 'aura', 'partner'
    const [roomPassword, setRoomPassword] = useState('');
    const [roomTheme, setRoomTheme] = useState('cosmic-purple');
    const [roomIntention, setRoomIntention] = useState('');
    const [roomSchedule, setRoomSchedule] = useState('one-time');
    const [sessionDuration, setSessionDuration] = useState('');

    const sessionDurations = [
        { id: '3', label: '3 minutes', minutes: 3 },
        { id: '9', label: '9 minutes', minutes: 9 },
        { id: '15', label: '15 minutes', minutes: 15 },
        { id: '30', label: '30 minutes', minutes: 30 },
        { id: '60', label: '1 hour', minutes: 60 },
        { id: 'unlimited', label: 'Unlimited', minutes: null }
    ];

    useEffect(() => {
        const savedRooms = localStorage.getItem('omnisync_rooms');
        if (savedRooms) {
            setRooms(JSON.parse(savedRooms));
        }
    }, []);

    const saveRooms = (updatedRooms) => {
        localStorage.setItem('omnisync_rooms', JSON.stringify(updatedRooms));
        setRooms(updatedRooms);
    };

    const intentions = [
        'Focus', 'Healing', 'Wind Down', 'Creativity', 'Relationship Harmony',
        'Grounding', 'Stress Release', 'Motivation', 'Joy', 'Gratitude',
        'Community Building', 'Chakra Focus'
    ];

    const themes = [
        { id: 'cosmic', name: 'Cosmic Purple', color: '#8b5cf6' },
        { id: 'ocean', name: 'Ocean Blue', color: '#0ea5e9' },
        { id: 'forest', name: 'Forest Green', color: '#10b981' },
        { id: 'sunset', name: 'Sunset Orange', color: '#f97316' },
        { id: 'rose', name: 'Rose Pink', color: '#ec4899' },
        { id: 'moon', name: 'Moonlight Silver', color: '#94a3b8' }
    ];

    const handleCreateRoom = () => {
        if (!roomName.trim()) return;

        const newRoom = {
            id: Date.now(),
            name: roomName,
            type: roomType,
            password: roomType === 'private' ? roomPassword : null,
            theme: roomTheme,
            intention: intention,
            host: 'You',
            members: [],
            isScheduled: isScheduled,
            scheduleType: scheduleType,
            createdAt: new Date().toISOString(),
            isActive: false
        };

        saveRooms([...rooms, newRoom]);
        setShowCreateModal(false);
        resetForm();
    };

    const resetForm = () => {
        setRoomName('');
        setRoomType('private');
        setRoomPassword('');
        setRoomTheme('cosmic');
        setIntention('');
        setIsScheduled(false);
        setScheduleType('once');
    };

    const getRoomTypeIcon = (type) => {
        switch (type) {
            case 'private': return <Lock size={16} />;
            case 'community': return <Globe size={16} />;
            case 'aura': return <Sparkles size={16} />;
            case 'partner': return <Heart size={16} />;
            default: return <Users size={16} />;
        }
    };

    const handleJoinRoom = (room) => {
        if (room.type === 'partner') {
            setShowPartnerSync(true);
        } else {
            setActiveRoom(room);
        }
    };

    const handleDeleteRoom = (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            const updatedRooms = rooms.filter(r => r.id !== roomId);
            saveRooms(updatedRooms);
        }
    };

    // If showing Partner Sync
    if (showPartnerSync) {
        return (
            <PartnerSyncPage
                onBack={() => setShowPartnerSync(false)}
                username={username}
            />
        );
    }

    // If in a room session, render RoomSession component
    if (activeRoom) {
        return (
            <RoomSession
                room={activeRoom}
                onBack={() => setActiveRoom(null)}
                username={username}
            />
        );
    }

    return (
        <div className="group-rooms-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Connections
            </button>

            <div className="rooms-header">
                <h1>
                    <Users size={32} />
                    Group Rooms
                </h1>
                <p>Shared sound spaces for connection & coherence</p>
            </div>

            <div className="rooms-content">
                {/* Quick Create Button */}
                <button
                    className="create-room-btn"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={20} />
                    Create New Room
                </button>

                {/* Room Types Info */}
                <div className="room-types-grid">
                    <div className="type-card">
                        <Lock size={24} className="type-icon" />
                        <h3>Private Rooms</h3>
                        <p>Invite-only spaces for friends, family, or partners</p>
                    </div>
                    <div className="type-card">
                        <Globe size={24} className="type-icon" />
                        <h3>Community Rooms</h3>
                        <p>Public or discoverable themed sessions</p>
                    </div>
                    <div className="type-card">
                        <Sparkles size={24} className="type-icon" />
                        <h3>Aura Rooms</h3>
                        <p>Color shifts based on group mood & elements</p>
                    </div>
                    <div className="type-card">
                        <Heart size={24} className="type-icon" />
                        <h3>Partner Sync</h3>
                        <p>Deep connection sessions for two</p>
                    </div>
                </div>

                {/* Active/Available Rooms */}
                <div className="rooms-section">
                    <h2>Your Rooms</h2>
                    {rooms.length === 0 ? (
                        <div className="empty-rooms">
                            <Users size={48} />
                            <p>No rooms yet</p>
                            <p className="empty-subtitle">Create your first group space above</p>
                        </div>
                    ) : (
                        <div className="rooms-grid">
                            {rooms.map(room => (
                                <div key={room.id} className="room-card" style={{ '--room-color': themes.find(t => t.id === room.theme)?.color }}>
                                    <div className="room-header">
                                        <div className="room-type-badge">
                                            {getRoomTypeIcon(room.type)}
                                            <span>{room.type}</span>
                                        </div>
                                        <div className="room-header-actions">
                                            {room.isActive && <span className="live-badge">LIVE</span>}
                                            <button
                                                className="delete-room-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRoom(room.id);
                                                }}
                                                title="Delete room"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3>{room.name}</h3>
                                    <div className="room-meta">
                                        <span className="room-intention">{room.intention || 'No intention set'}</span>
                                        <span className="room-members">
                                            <Users size={12} />
                                            {room.members.length} {room.members.length === 1 ? 'member' : 'members'}
                                        </span>
                                    </div>
                                    {room.isScheduled && (
                                        <div className="schedule-badge">
                                            <Calendar size={12} />
                                            Scheduled
                                        </div>
                                    )}
                                    <button
                                        className="join-room-btn"
                                        onClick={() => handleJoinRoom(room)}
                                    >
                                        <Play size={16} />
                                        {room.isActive ? 'Join Session' : 'Enter Room'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <h3>Create Group Room</h3>

                        <div className="form-section">
                            <label>Room Name</label>
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="e.g., Morning Reset, Twin Flame Sync"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="form-section">
                            <label>Room Type</label>
                            <div className="room-type-selector">
                                {[
                                    { id: 'private', label: 'Private', icon: Lock },
                                    { id: 'community', label: 'Community', icon: Globe },
                                    { id: 'aura', label: 'Aura Room', icon: Sparkles },
                                    { id: 'partner', label: 'Partner Sync', icon: Heart }
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        className={`type-option ${roomType === type.id ? 'selected' : ''}`}
                                        onClick={() => setRoomType(type.id)}
                                    >
                                        <type.icon size={20} />
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {roomType === 'private' && (
                            <div className="form-section">
                                <label>Password (Optional)</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    placeholder="Set a password for invite-only access"
                                    value={roomPassword}
                                    onChange={(e) => setRoomPassword(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="form-section">
                            <label>Room Theme</label>
                            <div className="theme-selector">
                                {themes.map(theme => (
                                    <button
                                        key={theme.id}
                                        className={`theme-option ${roomTheme === theme.id ? 'selected' : ''}`}
                                        onClick={() => setRoomTheme(theme.id)}
                                        style={{ '--theme-color': theme.color }}
                                    >
                                        <div className="theme-preview"></div>
                                        <span>{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Group Intention</label>
                            <select
                                className="modal-input"
                                value={intention}
                                onChange={(e) => setIntention(e.target.value)}
                            >
                                <option value="">Choose an intention...</option>
                                {intentions.map(int => (
                                    <option key={int} value={int}>{int}</option>
                                ))}
                            </select>
                        </div>

                        {/* Session Duration */}
                        <div className="form-section">
                            <label>Session Duration (Optional)</label>
                            <select
                                className="modal-input"
                                value={sessionDuration}
                                onChange={(e) => setSessionDuration(e.target.value)}
                            >
                                <option value="">No time limit</option>
                                {sessionDurations.map(duration => (
                                    <option key={duration.id} value={duration.id}>
                                        {duration.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-section">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isScheduled}
                                    onChange={(e) => setIsScheduled(e.target.checked)}
                                />
                                <span>Schedule recurring sessions</span>
                            </label>

                            {isScheduled && (
                                <select
                                    className="modal-input"
                                    value={scheduleType}
                                    onChange={(e) => setScheduleType(e.target.value)}
                                >
                                    <option value="once">One-time</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="newmoon">New Moon</option>
                                    <option value="fullmoon">Full Moon</option>
                                </select>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={handleCreateRoom}
                                disabled={!roomName.trim()}
                            >
                                Create Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
