import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Play, Pause, Volume2, MessageCircle, Heart, Sparkles, Zap, Wind, Sun, Moon, Star, Circle, Square, Triangle, Send, Settings as SettingsIcon, Eye, EyeOff, Crown, UserCheck, Sliders } from 'lucide-react';
import { categories } from '../data/frequencies';
import { journeys } from '../data/journeys';
import { soundscapes } from '../data/soundscapes';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import './RoomSession.css';

export function RoomSession({ room, onBack, username }) {
    const { play, stop, isPlaying: audioIsPlaying } = useBinauralBeat();
    const [sessionState, setSessionState] = useState('lobby'); // 'lobby', 'active', 'post'
    const [members, setMembers] = useState([
        { id: 1, name: username || 'You', color: '#8b5cf6', isHost: true, mode: 'listen', element: 'air' }
    ]);
    const [userMode, setUserMode] = useState('listen'); // 'listen', 'add-tone'
    const [userElement, setUserElement] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [sessionTime, setSessionTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSound, setSelectedSound] = useState(null);
    const [soundSource, setSoundSource] = useState('presets'); // 'presets', 'soundscapes', 'journeys', 'custom'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCustomGenerator, setShowCustomGenerator] = useState(false);
    const [showIntentionPrompt, setShowIntentionPrompt] = useState(true);
    const [userIntention, setUserIntention] = useState('');
    const [postSessionMood, setPostSessionMood] = useState('');
    const [postSessionReflection, setPostSessionReflection] = useState('');
    const [anonymousMode, setAnonymousMode] = useState(false);
    const canvasRef = useRef(null);
    const timerRef = useRef(null);

    const reactions = [
        { icon: Heart, label: 'Love', color: '#ec4899' },
        { icon: Sparkles, label: 'Magic', color: '#a78bfa' },
        { icon: Zap, label: 'Energy', color: '#fbbf24' },
        { icon: Wind, label: 'Flow', color: '#14b8a6' },
        { icon: Sun, label: 'Light', color: '#f97316' },
        { icon: Moon, label: 'Peace', color: '#94a3b8' },
        { icon: Star, label: 'Gratitude', color: '#fde047' }
    ];

    const elements = [
        { id: 'fire', name: 'Fire', color: '#ef4444' },
        { id: 'water', name: 'Water', color: '#3b82f6' },
        { id: 'earth', name: 'Earth', color: '#84cc16' },
        { id: 'air', name: 'Air', color: '#a78bfa' }
    ];

    useEffect(() => {
        if (sessionState === 'active' && isPlaying) {
            timerRef.current = setInterval(() => {
                setSessionTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionState, isPlaying]);

    // Mandala visualization
    useEffect(() => {
        if (sessionState === 'active' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const drawMandala = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Background glow
                const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
                gradient.addColorStop(0, `${room.theme === 'cosmic' ? '#8b5cf6' : '#14b8a6'}33`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw member circles
                const numMembers = members.length;
                const radius = 80 + (numMembers * 10);

                members.forEach((member, i) => {
                    const angle = (i * 2 * Math.PI) / numMembers + (sessionTime * 0.01);
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, 2 * Math.PI);
                    ctx.fillStyle = member.color + '66';
                    ctx.fill();
                    ctx.strokeStyle = member.color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });

                // Center pulse
                const pulseRadius = 30 + Math.sin(sessionTime * 0.05) * 10;
                ctx.beginPath();
                ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
                ctx.fillStyle = room.theme === 'cosmic' ? '#8b5cf644' : '#14b8a644';
                ctx.fill();

                requestAnimationFrame(drawMandala);
            };

            drawMandala();
        }
    }, [sessionState, members, sessionTime, room.theme]);

    const handleStartSession = () => {
        if (!selectedSound) {
            alert('Please select a sound to begin');
            return;
        }

        // Play the selected sound
        if (selectedSound.left !== undefined && selectedSound.right !== undefined) {
            // Binaural beat from presets
            play(selectedSound.left, selectedSound.right);
        } else if (selectedSound.frequencies) {
            // Soundscape
            play(selectedSound.frequencies.left, selectedSound.frequencies.right);
        } else if (selectedSound.stages) {
            // Journey - play first stage
            const firstStage = selectedSound.stages[0];
            if (firstStage.left && firstStage.right) {
                play(firstStage.left, firstStage.right);
            }
        }

        setSessionState('active');
        setIsPlaying(true);
        setShowIntentionPrompt(false);
    };

    const handleEndSession = () => {
        stop();
        setIsPlaying(false);
        setSessionState('post');
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            stop();
            setIsPlaying(false);
        } else {
            // Resume playback
            if (selectedSound.left !== undefined && selectedSound.right !== undefined) {
                play(selectedSound.left, selectedSound.right);
            } else if (selectedSound.frequencies) {
                play(selectedSound.frequencies.left, selectedSound.frequencies.right);
            }
            setIsPlaying(true);
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: anonymousMode ? 'Anonymous' : (username || 'You'),
            text: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages([...chatMessages, newMessage]);
        setMessageInput('');
    };

    const handleReaction = (reaction) => {
        // Visual feedback for reaction
        const reactionEl = document.createElement('div');
        reactionEl.className = 'floating-reaction';
        reactionEl.innerHTML = `<div style="color: ${reaction.color}">${reaction.label}</div>`;
        document.querySelector('.room-session').appendChild(reactionEl);
        setTimeout(() => reactionEl.remove(), 2000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // LOBBY VIEW
    if (sessionState === 'lobby') {
        return (
            <div className="room-session lobby">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Leave Room
                </button>

                <div className="lobby-content">
                    <div className="room-info-header">
                        <h1>{room.name}</h1>
                        <p className="room-intention">{room.intention || 'No intention set'}</p>
                    </div>

                    {/* Element Selection for Aura Rooms */}
                    {room.type === 'aura' && !userElement && (
                        <div className="element-selector">
                            <h3>Choose Your Element</h3>
                            <div className="elements-grid">
                                {elements.map(el => (
                                    <button
                                        key={el.id}
                                        className="element-option"
                                        style={{ '--element-color': el.color }}
                                        onClick={() => setUserElement(el.id)}
                                    >
                                        <Circle size={32} style={{ color: el.color }} />
                                        <span>{el.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Members in Room */}
                    <div className="lobby-members">
                        <h3>
                            <Users size={20} />
                            In the Room ({members.length})
                        </h3>
                        <div className="members-bubbles">
                            {members.map(member => (
                                <div
                                    key={member.id}
                                    className="member-bubble"
                                    style={{ '--member-color': member.color }}
                                >
                                    <div className="bubble-avatar">
                                        {member.isHost && <Crown size={12} className="host-crown" />}
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="member-name">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="mode-selector">
                        <h3>Your Mode</h3>
                        <div className="mode-options">
                            <button
                                className={`mode-option ${userMode === 'listen' ? 'selected' : ''}`}
                                onClick={() => setUserMode('listen')}
                            >
                                <Volume2 size={20} />
                                <span>Listen Only</span>
                            </button>
                            <button
                                className={`mode-option ${userMode === 'add-tone' ? 'selected' : ''}`}
                                onClick={() => setUserMode('add-tone')}
                            >
                                <Zap size={20} />
                                <span>Add Personal Tone</span>
                            </button>
                        </div>
                    </div>

                    {/* Sound Selection (Host) */}
                    {members[0].isHost && (
                        <div className="sound-selection">
                            <h3>Choose Session Sound</h3>

                            {/* Sound Source Tabs */}
                            <div className="sound-source-tabs">
                                <button
                                    className={`source-tab ${soundSource === 'presets' ? 'active' : ''}`}
                                    onClick={() => setSoundSource('presets')}
                                >
                                    Presets
                                </button>
                                <button
                                    className={`source-tab ${soundSource === 'soundscapes' ? 'active' : ''}`}
                                    onClick={() => setSoundSource('soundscapes')}
                                >
                                    Soundscapes
                                </button>
                                <button
                                    className={`source-tab ${soundSource === 'journeys' ? 'active' : ''}`}
                                    onClick={() => setSoundSource('journeys')}
                                >
                                    Journeys
                                </button>
                                <button
                                    className={`source-tab ${soundSource === 'custom' ? 'active' : ''}`}
                                    onClick={() => setSoundSource('custom')}
                                >
                                    <Sliders size={16} />
                                    Custom
                                </button>
                            </div>

                            {/* Presets */}
                            {soundSource === 'presets' && (
                                <div className="sound-options">
                                    <select
                                        className="category-select"
                                        value={selectedCategory || ''}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Select a category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                                        ))}
                                    </select>

                                    {selectedCategory && (
                                        <select
                                            className="sound-select"
                                            value={selectedSound?.id || ''}
                                            onChange={(e) => {
                                                const cat = categories.find(c => c.id === selectedCategory);
                                                const sound = cat?.items.find(i => i.id === e.target.value);
                                                setSelectedSound(sound);
                                            }}
                                        >
                                            <option value="">Select a sound...</option>
                                            {categories.find(c => c.id === selectedCategory)?.items.map(item => (
                                                <option key={item.id} value={item.id}>{item.title}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            {/* Soundscapes */}
                            {soundSource === 'soundscapes' && (
                                <div className="sound-options">
                                    <select
                                        className="sound-select"
                                        value={selectedSound?.id || ''}
                                        onChange={(e) => {
                                            const sound = soundscapes.find(s => s.id === e.target.value);
                                            setSelectedSound(sound);
                                        }}
                                    >
                                        <option value="">Select a soundscape...</option>
                                        {soundscapes.map(scape => (
                                            <option key={scape.id} value={scape.id}>{scape.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Journeys */}
                            {soundSource === 'journeys' && (
                                <div className="sound-options">
                                    <select
                                        className="sound-select"
                                        value={selectedSound?.id || ''}
                                        onChange={(e) => {
                                            const sound = journeys.find(j => j.id === e.target.value);
                                            setSelectedSound(sound);
                                        }}
                                    >
                                        <option value="">Select a journey...</option>
                                        {journeys.map(journey => (
                                            <option key={journey.id} value={journey.id}>{journey.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Custom Generator */}
                            {soundSource === 'custom' && (
                                <div className="sound-options">
                                    <div className="custom-generator-embed">
                                        <p className="custom-note">
                                            Custom generator mode will allow you to create a unique mix for this session.
                                        </p>
                                        <button
                                            className="custom-confirm-btn"
                                            onClick={() => {
                                                setSelectedSound({
                                                    id: 'custom',
                                                    title: 'Custom Mix',
                                                    left: 200,
                                                    right: 210,
                                                    desc: 'Custom binaural beat configuration'
                                                });
                                            }}
                                        >
                                            Use Custom Mode
                                        </button>
                                        <p className="custom-hint">
                                            You'll be able to configure the custom generator after starting the session
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedSound && (
                                <div className="selected-sound-preview">
                                    <div className="preview-icon">♪</div>
                                    <div className="preview-info">
                                        <span className="preview-title">{selectedSound.title || selectedSound.name}</span>
                                        <span className="preview-desc">{selectedSound.desc || selectedSound.description || 'Ready to play'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Custom Generator Layer Option (Host) */}
                    {members[0].isHost && selectedSound && soundSource !== 'custom' && (
                        <div className="custom-layer-option">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showCustomGenerator}
                                    onChange={(e) => setShowCustomGenerator(e.target.checked)}
                                />
                                <span>
                                    <Sliders size={16} />
                                    Layer Custom Generator on top
                                </span>
                            </label>

                            {showCustomGenerator && (
                                <div className="custom-generator-embed">
                                    <p className="custom-note">
                                        Custom layering will allow you to add additional frequencies on top of {selectedSound.title || selectedSound.name}
                                    </p>
                                    <div className="custom-layer-controls">
                                        <p className="custom-hint">
                                            Custom frequency layering coming soon! For now, you can use the base sound.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Intention Prompt */}
                    {showIntentionPrompt && (
                        <div className="intention-prompt">
                            <h3>Set Your Intention</h3>
                            <textarea
                                className="intention-input"
                                placeholder="What are you releasing or calling in today?"
                                value={userIntention}
                                onChange={(e) => setUserIntention(e.target.value)}
                                maxLength={200}
                            />
                        </div>
                    )}

                    {/* Start Button (Host) */}
                    {members[0].isHost && (
                        <button
                            className="start-session-btn"
                            onClick={handleStartSession}
                            disabled={!selectedSound}
                        >
                            <Play size={24} />
                            Start Session
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ACTIVE SESSION VIEW
    if (sessionState === 'active') {
        return (
            <div className="room-session active" style={{ '--room-theme': room.theme }}>
                <div className="session-header">
                    <div className="session-info">
                        <h2>{room.name}</h2>
                        <span className="session-timer">{formatTime(sessionTime)}</span>
                    </div>
                    <div className="session-controls">
                        <button
                            className="control-btn"
                            onClick={() => setAnonymousMode(!anonymousMode)}
                            title={anonymousMode ? 'Show Identity' : 'Hide Identity'}
                        >
                            {anonymousMode ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                            className="control-btn"
                            onClick={() => setShowChat(!showChat)}
                        >
                            <MessageCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Mandala Visualization */}
                <div className="visualization-container">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="mandala-canvas"
                    />
                    <div className="coherence-indicator">
                        <div className="coherence-label">Group Coherence</div>
                        <div className="coherence-bar">
                            <div
                                className="coherence-fill"
                                style={{ width: `${65 + Math.sin(sessionTime * 0.1) * 15}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Reactions Bar */}
                <div className="reactions-bar">
                    {reactions.map(reaction => (
                        <button
                            key={reaction.label}
                            className="reaction-btn"
                            onClick={() => handleReaction(reaction)}
                            style={{ '--reaction-color': reaction.color }}
                        >
                            <reaction.icon size={20} />
                        </button>
                    ))}
                </div>

                {/* Chat Panel */}
                {showChat && (
                    <div className="chat-panel">
                        <div className="chat-messages">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className="chat-message">
                                    <span className="message-sender">{msg.sender}</span>
                                    <span className="message-text">{msg.text}</span>
                                    <span className="message-time">{msg.timestamp}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Send a supportive message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button className="send-btn" onClick={handleSendMessage}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Playback Controls */}
                <div className="playback-controls">
                    <button
                        className="playback-btn"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    {members[0].isHost && (
                        <button
                            className="end-session-btn"
                            onClick={handleEndSession}
                        >
                            End Session
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // POST-SESSION VIEW
    if (sessionState === 'post') {
        return (
            <div className="room-session post">
                <div className="post-session-content">
                    <h1>Session Complete</h1>
                    <div className="session-summary">
                        <div className="summary-stat">
                            <span className="stat-value">{formatTime(sessionTime)}</span>
                            <span className="stat-label">Duration</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-value">{members.length}</span>
                            <span className="stat-label">Participants</span>
                        </div>
                    </div>

                    {/* Mood Check-in */}
                    <div className="post-section">
                        <h3>How do you feel?</h3>
                        <div className="mood-options">
                            {['Peaceful', 'Energized', 'Grounded', 'Inspired', 'Grateful'].map(mood => (
                                <button
                                    key={mood}
                                    className={`mood-btn ${postSessionMood === mood ? 'selected' : ''}`}
                                    onClick={() => setPostSessionMood(mood)}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reflection */}
                    <div className="post-section">
                        <h3>What shifted?</h3>
                        <textarea
                            className="reflection-input"
                            placeholder="Share your experience..."
                            value={postSessionReflection}
                            onChange={(e) => setPostSessionReflection(e.target.value)}
                            maxLength={300}
                        />
                    </div>

                    {/* Mandala Snapshot */}
                    <div className="post-section">
                        <h3>Group Mandala</h3>
                        <div className="mandala-snapshot">
                            <canvas ref={canvasRef} width={300} height={300} />
                            <button className="save-mandala-btn">
                                Save to Sync History
                            </button>
                        </div>
                    </div>

                    <button className="return-btn" onClick={onBack}>
                        Return to Rooms
                    </button>
                </div>
            </div>
        );
    }
}
