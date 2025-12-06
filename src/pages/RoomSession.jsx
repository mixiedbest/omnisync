import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Play, Pause, Volume2, MessageCircle, Heart, Sparkles, Zap, Wind, Sun, Moon, Star, Circle, Square, Triangle, Send, Settings as SettingsIcon, Eye, EyeOff, Crown, UserCheck, Sliders, Mic, MicOff } from 'lucide-react';
import { categories } from '../data/frequencies';
import { journeys } from '../data/journeys';
import { soundscapes } from '../data/soundscapes';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import { CustomGenerator } from '../components/CustomGenerator';
import './RoomSession.css';

export function RoomSession({ room, onBack, username }) {
    // Debug logging
    console.log('RoomSession rendering with:', { room, username });

    const { play, stop, isPlaying: audioIsPlaying, enableMicrophone, disableMicrophone, setMicVolume, isMicActive, updateLayers, updateNoise, updateSoundscape } = useBinauralBeat();
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
    const [personalToneFreq, setPersonalToneFreq] = useState(432);
    const [personalToneVol, setPersonalToneVol] = useState(0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSound, setSelectedSound] = useState(null);
    const [showLiveGenerator, setShowLiveGenerator] = useState(false);
    // Custom Layering State
    const [customLayer, setCustomLayer] = useState(null);
    const [isCustomLayerActive, setIsCustomLayerActive] = useState(false);
    const [soundSource, setSoundSource] = useState('presets'); // 'presets', 'soundscapes', 'journeys', 'custom'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCustomGenerator, setShowCustomGenerator] = useState(false);
    const [debugStatus, setDebugStatus] = useState('');
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

    const sessionDurations = [
        { id: '3', label: '3 minutes', minutes: 3 },
        { id: '9', label: '9 minutes', minutes: 9 },
        { id: '15', label: '15 minutes', minutes: 15 },
        { id: '30', label: '30 minutes', minutes: 30 },
        { id: '60', label: '1 hour', minutes: 60 },
        { id: 'unlimited', label: 'Unlimited', minutes: null }
    ];

    useEffect(() => {
        if (sessionState === 'active' && isPlaying && room && room.sessionDuration) {
            timerRef.current = setInterval(() => {
                setSessionTime(prev => {
                    const newTime = prev + 1;

                    // Check if session duration is set and time is up
                    const duration = sessionDurations.find(d => d.id === room.sessionDuration);
                    if (duration && duration.minutes) {
                        const maxSeconds = duration.minutes * 60;
                        if (newTime >= maxSeconds) {
                            // Auto-end session when time is up
                            stop();
                            setIsPlaying(false);
                            setSessionState('post');
                            return maxSeconds;
                        }
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionState, isPlaying, room?.sessionDuration]);

    // Mandala visualization
    useEffect(() => {
        if (sessionState === 'active' && canvasRef.current && room) {
            const canvas = canvasRef.current;
            if (!canvas) {
                console.warn('Canvas ref is null');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Failed to get canvas context');
                return;
            }

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

    // Sync Layers seamlessly when Custom Layer/State changes (without restarting Base)
    useEffect(() => {
        if (isPlaying && selectedSound) {
            const params = getPlaybackParams(); // Uses current state (customLayer, isCustomLayerActive, etc)
            if (params) {
                // Seamlessly update Layers and Noise
                if (updateLayers) {
                    updateLayers(params.layers, params.volumes);
                }
                if (updateNoise) {
                    updateNoise(params.noiseType, params.volumes?.noise);
                }
                if (updateSoundscape) {
                    updateSoundscape(params.soundscapeType, params.volumes?.soundscape);
                }
            }
        }
    }, [customLayer, isCustomLayerActive, userMode, personalToneFreq, personalToneVol, isPlaying, selectedSound, updateLayers, updateNoise, updateSoundscape]);

    // Helper to construct playback parameters merging Session Sound + Personal Layers + Element
    const getPlaybackParams = (soundOverride = null) => {
        const sound = soundOverride || selectedSound;
        if (!sound) return null;

        let left = sound.left || 0;
        let right = sound.right || 0;
        let noiseType = sound.noiseType || null;
        let soundscapeType = sound.type || sound.soundscapeType || null;

        if (sound.frequencies) {
            left = sound.frequencies.left;
            right = sound.frequencies.right;
        } else if (sound.stages) {
            const stage = sound.stages[0];
            left = stage.left;
            right = stage.right;
        } else if (sound.short?.phases || sound.long?.phases) {
            // Handle Journeys (default to short phases for now if not specified or just pick one)
            // Ideally we track which duration User selected, but for now we default to 'short' if available.
            const phases = sound.short?.phases || sound.long?.phases;
            if (phases && phases.length > 0) {
                const stage = phases[0];
                left = stage.freq;
                // 'bothEars' in journeys.js refers to the Difference (Beat Frequency) usually?
                // Or is it Isochronic? Based on names (Alpha 10Hz), it's the beat frequency.
                // freq=432, bothEars=10 -> Right = 442.
                right = stage.freq + (stage.bothEars || 0);

                // Stage Overrides
                if (stage.noiseType !== undefined) noiseType = stage.noiseType;
                if (stage.soundscapeType !== undefined) soundscapeType = stage.soundscapeType;

                // If stage has specific volumes? Journeys usually balanced.
            }
        }

        // Element Soundscape Mapping
        const elementMap = { fire: 'firewood', water: 'ocean', earth: 'earth', air: 'nature-walk' };
        // Priority: User Element > Session Soundscape
        // Priority: User Element > Session Soundscape
        if (userElement && elementMap[userElement]) {
            soundscapeType = elementMap[userElement];
        } else if (isCustomLayerActive && (customLayer?.type || customLayer?.soundscapeType)) {
            soundscapeType = customLayer.type || customLayer.soundscapeType;
        }
        // If not set by element or sound, checks above handle it, 
        // but if Journey set it, it's already in 'soundscapeType' var.

        // Layers
        const layers = [...(sound.layers || [])];
        if (userMode === 'add-tone') {
            layers.push({
                id: 'personal',
                carrierFreq: personalToneFreq,
                beatFreq: 0,
                volume: personalToneVol
            });
        }

        // Custom Generator Layering (if active and not source)
        if (isCustomLayerActive && customLayer && soundSource !== 'custom') {
            // Prefer explicit layers list
            if (customLayer.layers && customLayer.layers.length > 0) {
                layers.push(...customLayer.layers);
            }
            // Fallback for simple custom sounds (if any)
            else if (customLayer.left && customLayer.right) {
                layers.push({
                    id: 'custom-main',
                    carrierFreq: customLayer.left,
                    beatFreq: customLayer.right - customLayer.left,
                    volume: (customLayer.volumes?.binaural !== undefined ? customLayer.volumes.binaural : 0.5)
                });
            }
            // Noise Override (optional, prioritized if present)
            // If Generator has noise, use it? Or mix?
            // We'll let generator override for 'DJ' feel.
            if (customLayer.noiseType) {
                // params object is created below, we can capture noiseType there
            }
        }

        // Merge volumes (Custom Layer overrides if active)
        const activeVolumes = { ...(sound.volumes || {}) };
        if (isCustomLayerActive && customLayer?.volumes) {
            // Only override if custom layer defines these aspects, or simply merge all?
            // Custom Generator UI implies control over the specific elements it generates.
            // If custom layer has a noise type selected, we definitely want its volume.
            if (customLayer.noiseType && customLayer.noiseType !== 'none') {
                activeVolumes.noise = customLayer.volumes.noise;
            }
            if ((customLayer.type || customLayer.soundscapeType) && (customLayer.type !== 'none' && customLayer.soundscapeType !== 'none')) {
                activeVolumes.soundscape = customLayer.volumes.soundscape;
            }
        }

        return {
            left, right,
            bothEars: sound.bothEars || 0,
            noiseType: (isCustomLayerActive && customLayer?.noiseType) || sound.noiseType || null,
            soundscapeType,
            volumes: activeVolumes,
            layers
        };
    };

    const handleStartSession = () => {
        const params = getPlaybackParams();
        if (!params) {
            alert('Please select a sound to begin');
            return;
        }

        setDebugStatus('Initializing playback...');

        try {
            play(
                params.left,
                params.right,
                params.bothEars,
                params.noiseType,
                params.soundscapeType,
                params.volumes,
                params.layers
            );

            setDebugStatus('Playback started');
        } catch (e) {
            console.error(e);
            setDebugStatus('Error: ' + e.message);
            alert('Playback Error: ' + e.message);
            return;
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
            const params = getPlaybackParams();
            if (params) {
                play(
                    params.left,
                    params.right,
                    params.bothEars,
                    params.noiseType,
                    params.soundscapeType,
                    params.volumes,
                    params.layers
                );
                setIsPlaying(true);
            }
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

    const getTimeRemaining = () => {
        if (!room.sessionDuration) return null;
        const duration = sessionDurations.find(d => d.id === room.sessionDuration);
        if (!duration || !duration.minutes) return null;
        const remaining = (duration.minutes * 60) - sessionTime;
        return remaining > 0 ? remaining : 0;
    };

    // Safety check - render error if room is null
    if (!room) {
        return (
            <div className="room-session">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Rooms
                </button>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <p>Error: Room data not found</p>
                </div>
            </div>
        );
    }

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

                        {/* Personal Tone Configuration */}
                        {userMode === 'add-tone' && (
                            <div className="personal-tone-config" style={{
                                marginTop: '16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(139, 92, 246, 0.2)'
                            }}>
                                <h4 style={{ marginBottom: '12px', color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Sliders size={14} /> Configure Tone
                                </h4>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '120px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                            Frequency: {personalToneFreq} Hz
                                        </label>
                                        <input
                                            type="range" min="50" max="800" step="1"
                                            value={personalToneFreq}
                                            onChange={(e) => setPersonalToneFreq(Number(e.target.value))}
                                            style={{ width: '100%', accentColor: '#8b5cf6' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '120px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                            Volume: {Math.round(personalToneVol * 100)}%
                                        </label>
                                        <input
                                            type="range" min="0" max="1" step="0.05"
                                            value={personalToneVol}
                                            onChange={(e) => setPersonalToneVol(Number(e.target.value))}
                                            style={{ width: '100%', accentColor: '#8b5cf6' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
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
                                    <CustomGenerator
                                        onGenerate={(sound) => {
                                            setSelectedSound(sound);
                                            // Feedback
                                            const btn = document.querySelector('.generate-btn');
                                            if (btn) {
                                                const originalText = btn.innerText;
                                                btn.innerText = 'Sound Set! ✓';
                                                setTimeout(() => btn.innerText = originalText, 2000);
                                            }
                                        }}
                                        actionLabel="Set Session Sound"
                                        isActive={selectedSound?.id === 'custom-combined' && isPlaying}
                                    />
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

                    {/* Audio Debug Status */}
                    <div style={{ padding: '0 20px 12px' }}>
                        {debugStatus && (
                            <div style={{ fontSize: '11px', color: 'var(--accent-teal)', textAlign: 'center', marginBottom: '8px', fontFamily: 'monospace' }}>
                                Status: {debugStatus}
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                try {
                                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                                    const ctx = new AudioContext();
                                    const osc = ctx.createOscillator();
                                    const gain = ctx.createGain();
                                    gain.gain.value = 0.1;
                                    osc.connect(gain);
                                    gain.connect(ctx.destination);
                                    osc.start();
                                    osc.stop(ctx.currentTime + 0.2);
                                    setDebugStatus('System audio OK');
                                } catch (err) {
                                    setDebugStatus('System audio failed');
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px dashed rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                color: 'var(--text-muted)',
                                fontSize: '11px',
                                cursor: 'pointer'
                            }}
                        >
                            🔊 Test System Audio
                        </button>
                    </div>

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
                        <span className="session-timer">
                            {getTimeRemaining() !== null
                                ? `${formatTime(getTimeRemaining())} remaining`
                                : formatTime(sessionTime)
                            }
                        </span>
                    </div>
                    <div className="session-controls">
                        {members[0].isHost && (
                            <button
                                className={`control-btn ${showLiveGenerator ? 'active' : ''}`}
                                onClick={() => setShowLiveGenerator(!showLiveGenerator)}
                                title="Live Sound Mixer"
                                style={showLiveGenerator ? { background: 'var(--accent-purple)', color: 'white' } : {}}
                            >
                                <Sliders size={20} />
                            </button>
                        )}
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


                {/* Live Generator Panel (Host) */}
                {showLiveGenerator && members[0].isHost && (
                    <div className="live-generator-panel" style={{
                        position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
                        width: '95%', maxWidth: '600px', maxHeight: '70vh', overflowY: 'auto',
                        background: 'rgba(17, 24, 39, 0.95)', border: '1px solid var(--accent-purple)',
                        borderRadius: '16px', padding: '20px', zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <h3 style={{ margin: 0, color: 'var(--accent-teal)' }}>Live Mixer</h3>
                                <label className="layer-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                                    <input
                                        type="checkbox"
                                        checked={isCustomLayerActive}
                                        onChange={(e) => {
                                            setIsCustomLayerActive(e.target.checked);
                                            // Force update if playing
                                            setTimeout(() => {
                                                if (isPlaying) {
                                                    const params = getPlaybackParams();
                                                    if (params) play(params.left, params.right, params.bothEars, params.noiseType, params.soundscapeType, params.volumes, params.layers);
                                                }
                                            }, 0);
                                        }}
                                        style={{ accentColor: 'var(--accent-purple)' }}
                                    />
                                    <span style={{ fontSize: '12px', fontWeight: '600' }}>Layer ON</span>
                                </label>
                            </div>
                            <button style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }} onClick={() => setShowLiveGenerator(false)}>✕</button>
                        </div>
                        <CustomGenerator
                            onGenerate={(sound) => {
                                setCustomLayer(sound);
                                // React Effect handles the audio update seamlessly now!
                                if (!isCustomLayerActive) setIsCustomLayerActive(true);
                            }}
                            onPause={() => setIsCustomLayerActive(false)}
                            actionLabel="Update Mix Layer"
                            isActive={isCustomLayerActive}
                        />
                        <p style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', textAlign: 'center' }}>
                            Toggle "Layer ON" to hear this generator on top of the preset.
                        </p>
                    </div>
                )}

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
                {
                    showChat && (
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
                    )
                }

                {/* Playback Controls */}
                <div className="playback-controls">
                    {/* Host Mic Control */}
                    {members[0].isHost && (
                        <div className="mic-control-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '16px' }}>
                            <button
                                className={`control-btn ${isMicActive ? 'active' : ''}`}
                                onClick={isMicActive ? disableMicrophone : enableMicrophone}
                                title={isMicActive ? "Mute Mic" : "Enable Mic"}
                                style={isMicActive ? { background: 'var(--accent-purple)', color: 'white', borderColor: 'transparent', boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' } : {}}
                            >
                                {isMicActive ? <Mic size={24} /> : <MicOff size={24} />}
                            </button>

                            {isMicActive && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '10px', color: 'var(--accent-purple)', fontWeight: '600' }}>MIC VOL</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        defaultValue="1"
                                        onChange={(e) => setMicVolume(parseFloat(e.target.value))}
                                        style={{ width: '80px', accentColor: 'var(--accent-purple)', height: '4px' }}
                                        title="Mic Volume"
                                    />
                                </div>
                            )}
                        </div>
                    )}
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
            </div >
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



                    <button className="return-btn" onClick={onBack}>
                        Return to Rooms
                    </button>
                </div>
            </div>
        );
    }

    // Default fallback (should never reach here)
    return (
        <div className="room-session">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Rooms
            </button>
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading room...</p>
            </div>
        </div>
    );
}
