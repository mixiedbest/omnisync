import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Heart, Users, Play, Pause, Volume2, Sparkles, Wind, Flame, Droplet, Mountain, Send, Eye, EyeOff } from 'lucide-react';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import { categories } from '../data/frequencies';
import './PartnerSyncPage.css';

export function PartnerSyncPage({ onBack, username, onSessionComplete }) {
    const { play, stop } = useBinauralBeat();
    const [sessionState, setSessionState] = useState('setup'); // 'setup', 'waiting', 'active', 'post'
    const [syncGoal, setSyncGoal] = useState('');
    const [relationshipType, setRelationshipType] = useState('');
    const [sharedIntention, setSharedIntention] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
    const [breathCount, setBreathCount] = useState(4);
    const [showJournal, setShowJournal] = useState(false);
    const [myReflection, setMyReflection] = useState('');
    const [shareReflection, setShareReflection] = useState(false);
    const [currentMood, setCurrentMood] = useState('');
    const [syncMode, setSyncMode] = useState('journey'); // 'preset' or 'journey'
    const [selectedPreset, setSelectedPreset] = useState(''); // For preset mode
    const [userElement, setUserElement] = useState('');
    const [currentStage, setCurrentStage] = useState(0); // 0: grounding, 1: transition, 2: goal
    const [stageStartTime, setStageStartTime] = useState(0);
    const canvasRef = useRef(null);
    const timerRef = useRef(null);

    const moods = [
        { id: 'calm', label: 'Calm', freq: 4 },
        { id: 'anxious', label: 'Anxious', freq: 10 },
        { id: 'tired', label: 'Tired', freq: 2.5 },
        { id: 'energized', label: 'Energized', freq: 15 },
        { id: 'stressed', label: 'Stressed', freq: 7.83 },
        { id: 'happy', label: 'Happy', freq: 8 },
        { id: 'sad', label: 'Sad', freq: 5 }
    ];

    const syncGoals = [
        { id: 'relax', label: 'Relax + Calm Together', freq: 4, chakra: 'root' },
        { id: 'communication', label: 'Improve Communication', freq: 7, chakra: 'throat' },
        { id: 'creativity', label: 'Boost Creativity', freq: 10, chakra: 'sacral' },
        { id: 'intimacy', label: 'Emotional Intimacy', freq: 5, chakra: 'heart' },
        { id: 'grounding', label: 'Grounding & Safety', freq: 7.83, chakra: 'root' },
        { id: 'manifestation', label: 'Manifestation Intention', freq: 8, chakra: 'third-eye' },
        { id: 'sleep', label: 'Sleep + Nervous System Regulation', freq: 2.5, chakra: 'crown' }
    ];

    const relationshipTypes = [
        { id: 'romantic', label: 'Romantic Partners', color: '#ec4899' },
        { id: 'friends', label: 'Friends', color: '#fbbf24' },
        { id: 'family', label: 'Family', color: '#10b981' },
        { id: 'creative', label: 'Creative Partners', color: '#8b5cf6' },
        { id: 'healing', label: 'Healing Practitioner + Client', color: '#14b8a6' }
    ];

    const elements = [
        { id: 'fire', name: 'Fire', icon: Flame, color: '#ef4444' },
        { id: 'water', name: 'Water', icon: Droplet, color: '#3b82f6' },
        { id: 'earth', name: 'Earth', icon: Mountain, color: '#84cc16' },
        { id: 'air', name: 'Air', icon: Wind, color: '#a78bfa' }
    ];

    // Journey stages - must be defined before useEffects that use it
    const journeyStages = useMemo(() => {
        const selectedGoal = syncGoals.find(g => g.id === syncGoal);
        const selectedMood = moods.find(m => m.id === currentMood);
        const goalFreq = selectedGoal ? selectedGoal.freq : 7.83;
        const moodFreq = selectedMood ? selectedMood.freq : 7.83;

        // Relationship type adjustments
        const relationshipDiff = {
            'romantic': 5,
            'friends': 8,
            'family': 3,
            'creative': 12,
            'healing': 2
        }[relationshipType] || 7;

        return [
            // Stage 1: Grounding (based on current mood)
            {
                name: 'Grounding',
                duration: 120, // 2 minutes
                left: moodFreq,
                right: moodFreq + 2,
                description: 'Settling into your current state'
            },
            // Stage 2: Transition (blend mood → goal)
            {
                name: 'Transition',
                duration: 180, // 3 minutes
                left: (moodFreq + goalFreq) / 2,
                right: (moodFreq + goalFreq) / 2 + relationshipDiff / 2,
                description: 'Moving toward alignment'
            },
            // Stage 3: Goal state (full goal frequency)
            {
                name: 'Goal State',
                duration: null, // Unlimited
                left: goalFreq,
                right: goalFreq + relationshipDiff,
                description: 'Aligned in your intention'
            }
        ];
    }, [syncGoal, currentMood, relationshipType]);

    // Breathing guide
    useEffect(() => {
        if (sessionState === 'active' && isPlaying) {
            const breathCycle = setInterval(() => {
                setBreathPhase(prev => {
                    if (prev === 'inhale') {
                        setBreathCount(2);
                        return 'hold';
                    } else if (prev === 'hold') {
                        setBreathCount(6);
                        return 'exhale';
                    } else {
                        setBreathCount(4);
                        return 'inhale';
                    }
                });
            }, breathPhase === 'inhale' ? 4000 : breathPhase === 'hold' ? 2000 : 6000);

            return () => clearInterval(breathCycle);
        }
    }, [sessionState, isPlaying, breathPhase]);

    // Session timer
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

    // Stage progression for journey-style sync
    useEffect(() => {
        if (sessionState === 'active' && isPlaying && syncMode === 'journey') {
            const currentStageData = journeyStages[currentStage];

            if (currentStageData && currentStageData.duration) {
                const stageElapsed = sessionTime - stageStartTime;

                if (stageElapsed >= currentStageData.duration && currentStage < journeyStages.length - 1) {
                    // Move to next stage
                    const nextStage = currentStage + 1;
                    const nextStageData = journeyStages[nextStage];

                    setCurrentStage(nextStage);
                    setStageStartTime(sessionTime);

                    // Update audio to next stage frequencies
                    const elementMap = { fire: 'firewood', water: 'ocean', earth: 'earth', air: 'nature-walk' };
                    const soundscape = userElement ? elementMap[userElement] : null;

                    play(nextStageData.left, nextStageData.right, 0, null, soundscape);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionTime, sessionState, isPlaying, syncMode, currentStage, stageStartTime, journeyStages, userElement, play]);

    // Energy cord visualization
    useEffect(() => {
        if (sessionState === 'active' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            let animationFrame;
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const time = Date.now() * 0.001;
                const separation = 80 + Math.sin(time * 0.5) * 20;

                // Person 1 orb (left)
                const x1 = centerX - separation;
                const y1 = centerY;
                const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 40);
                gradient1.addColorStop(0, '#ec489980');
                gradient1.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient1;
                ctx.beginPath();
                ctx.arc(x1, y1, 40, 0, Math.PI * 2);
                ctx.fill();

                // Person 2 orb (right)
                const x2 = centerX + separation;
                const y2 = centerY;
                const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 40);
                gradient2.addColorStop(0, '#8b5cf680');
                gradient2.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient2;
                ctx.beginPath();
                ctx.arc(x2, y2, 40, 0, Math.PI * 2);
                ctx.fill();

                // Energy cord connecting them
                ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 + Math.sin(time * 2) * 0.2})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.quadraticCurveTo(centerX, centerY - 30, x2, y2);
                ctx.stroke();

                // Particles along the cord
                for (let i = 0; i < 5; i++) {
                    const t = (time * 0.2 + i * 0.2) % 1;
                    const px = x1 + (x2 - x1) * t;
                    const py = y1 + (y2 - y1) * t - 30 * Math.sin(Math.PI * t);

                    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 - t * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                animationFrame = requestAnimationFrame(draw);
            };

            draw();
            return () => cancelAnimationFrame(animationFrame);
        }
    }, [sessionState]);

    const buildSyncSound = () => {
        // Get base frequency from goal
        const selectedGoal = syncGoals.find(g => g.id === syncGoal);
        let baseFreq = selectedGoal ? selectedGoal.freq : 7.83;

        // Adjust for mood
        const selectedMood = moods.find(m => m.id === currentMood);
        if (selectedMood) {
            // Blend goal and mood frequencies
            baseFreq = (baseFreq + selectedMood.freq) / 2;
        }

        // Adjust for relationship type
        const relationshipAdjustments = {
            'romantic': { left: baseFreq, right: baseFreq + 5 }, // Heart-centered
            'friends': { left: baseFreq, right: baseFreq + 8 }, // Playful energy
            'family': { left: baseFreq, right: baseFreq + 3 }, // Grounding
            'creative': { left: baseFreq, right: baseFreq + 12 }, // Higher activation
            'healing': { left: baseFreq, right: baseFreq + 2 } // Gentle, subtle
        };

        return relationshipAdjustments[relationshipType] || { left: baseFreq, right: baseFreq + 7 };
    };

    const handleStartSync = () => {
        // Validation based on mode
        if (syncMode === 'journey') {
            if (!syncGoal || !relationshipType || !currentMood) {
                alert('Please complete all fields before starting');
                return;
            }
        } else {
            // Preset mode only needs preset selection
            if (!selectedPreset) {
                alert('Please select a preset sound');
                return;
            }
        }

        if (syncMode === 'journey') {
            // Journey mode: Start with first stage
            const firstStage = journeyStages[0];
            const elementMap = { fire: 'firewood', water: 'ocean', earth: 'earth', air: 'nature-walk' };
            const soundscape = userElement ? elementMap[userElement] : null;

            play(firstStage.left, firstStage.right, 0, null, soundscape);
            setCurrentStage(0);
            setStageStartTime(0);
        } else {
            // Preset mode: Use selected preset sound
            if (!selectedPreset) {
                alert('Please select a preset sound');
                return;
            }

            // Find the selected sound from categories
            let selectedSound = null;
            for (const category of categories) {
                selectedSound = category.items.find(item => item.id === selectedPreset);
                if (selectedSound) break;
            }

            if (selectedSound) {
                play(selectedSound.left, selectedSound.right);
            }
        }

        setSessionState('active');
        setIsPlaying(true);
    };

    const handleEndSync = () => {
        stop();
        setIsPlaying(false);
        setSessionState('post');

        // Call the callback to update connection milestones
        if (onSessionComplete && partnerName) {
            onSessionComplete(partnerName, sessionTime);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // SETUP VIEW
    if (sessionState === 'setup') {
        return (
            <div className="partner-sync-page">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="sync-header">
                    <div className="sync-icon">
                        <Heart size={48} />
                    </div>
                    <h1>Partner Sync</h1>
                    <p>Create energetic alignment with someone you care about</p>
                </div>

                <div className="sync-setup">
                    {/* Partner Name */}
                    <div className="setup-section">
                        <label>Partner's Name</label>
                        <input
                            type="text"
                            className="sync-input"
                            placeholder="Who are you syncing with?"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                        />
                    </div>

                    {/* Sync Mode */}
                    <div className="setup-section">
                        <label>Sync Mode</label>
                        <div className="mode-selector">
                            <button
                                type="button"
                                className={`mode-option ${syncMode === 'journey' ? 'selected' : ''}`}
                                onClick={() => setSyncMode('journey')}
                            >
                                <Sparkles size={20} />
                                <div>
                                    <div className="mode-title">Journey Mode</div>
                                    <div className="mode-desc">Progressive stages that ease into the goal</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                className={`mode-option ${syncMode === 'preset' ? 'selected' : ''}`}
                                onClick={() => setSyncMode('preset')}
                            >
                                <Volume2 size={20} />
                                <div>
                                    <div className="mode-title">Preset Mode</div>
                                    <div className="mode-desc">Single frequency based on goal & mood</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Journey Mode Fields - Only show in Journey Mode */}
                    {syncMode === 'journey' && (
                        <>
                            {/* Sync Goal */}
                            <div className="setup-section">
                                <label>Sync Goal</label>
                                <div className="goal-grid">
                                    {syncGoals.map(goal => (
                                        <button
                                            key={goal.id}
                                            className={`goal-option ${syncGoal === goal.id ? 'selected' : ''}`}
                                            onClick={() => setSyncGoal(goal.id)}
                                        >
                                            {goal.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Relationship Type */}
                            <div className="setup-section">
                                <label>Relationship Type</label>
                                <div className="relationship-grid">
                                    {relationshipTypes.map(type => (
                                        <button
                                            key={type.id}
                                            className={`relationship-option ${relationshipType === type.id ? 'selected' : ''}`}
                                            onClick={() => setRelationshipType(type.id)}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Mood */}
                            <div className="setup-section">
                                <label>How are you feeling right now?</label>
                                <div className="mood-grid">
                                    {moods.map(mood => (
                                        <button
                                            key={mood.id}
                                            className={`mood-option ${currentMood === mood.id ? 'selected' : ''}`}
                                            onClick={() => setCurrentMood(mood.id)}
                                        >
                                            {mood.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Element Selection - Add into the environment */}
                            <div className="setup-section">
                                <label>Add an Element (Optional)</label>
                                <div className="element-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                    {elements.map(element => {
                                        const Icon = element.icon;
                                        return (
                                            <button
                                                type="button"
                                                key={element.id}
                                                className={`element-option ${userElement === element.id ? 'selected' : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setUserElement(prev => prev === element.id ? '' : element.id);
                                                }}
                                                style={{
                                                    padding: '16px',
                                                    background: userElement === element.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                                    border: `1px solid ${userElement === element.id ? element.color : 'rgba(255, 255, 255, 0.1)'}`,
                                                    borderRadius: '12px',
                                                    color: 'var(--text-primary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Icon size={24} color={element.color} />
                                                <span style={{ fontSize: '12px', fontWeight: '500' }}>{element.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Preset Sound Selector - Only in Preset Mode */}
                    {syncMode === 'preset' && (
                        <div className="setup-section">
                            <label>Choose Preset Sound</label>
                            <div className="preset-categories">
                                {categories.slice(0, 5).map(category => (
                                    <div key={category.id} className="preset-category">
                                        <h4>{category.title}</h4>
                                        <div className="preset-sounds">
                                            {category.items.map(sound => (
                                                <button
                                                    type="button"
                                                    key={sound.id}
                                                    className={`preset-sound-option ${selectedPreset === sound.id ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedPreset(sound.id);
                                                    }}
                                                >
                                                    {sound.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shared Intention */}
                    <div className="setup-section">
                        <label>Shared Intention (Optional)</label>
                        <input
                            type="text"
                            className="sync-input"
                            placeholder="e.g., Peace, Reconnection, Clarity, Healing..."
                            value={sharedIntention}
                            onChange={(e) => setSharedIntention(e.target.value)}
                            maxLength={30}
                        />
                    </div>

                    <button className="start-sync-btn" onClick={handleStartSync}>
                        <Heart size={20} />
                        Begin Partner Sync
                    </button>
                </div>
            </div>
        );
    }

    // ACTIVE SESSION VIEW
    if (sessionState === 'active') {
        return (
            <div className="partner-sync-page active">
                <div className="sync-session">
                    <div className="session-header">
                        <h2>{partnerName ? `Syncing with ${partnerName}` : 'Partner Sync'}</h2>
                        <span className="session-timer">{formatTime(sessionTime)}</span>
                    </div>

                    {/* Journey Stage Indicator - Only in Journey Mode */}
                    {syncMode === 'journey' && journeyStages && journeyStages[currentStage] && (
                        <div className="journey-stage-indicator">
                            {journeyStages.map((stage, index) => (
                                <div
                                    key={index}
                                    className={`stage-dot ${index === currentStage ? 'active' : ''} ${index < currentStage ? 'completed' : ''}`}
                                    title={stage.name}
                                >
                                    {index < currentStage && '✓'}
                                </div>
                            ))}
                            <div className="stage-info">
                                <span className="stage-name">{journeyStages[currentStage].name}</span>
                                <span className="stage-desc">{journeyStages[currentStage].description}</span>
                            </div>
                        </div>
                    )}

                    {/* Affirmation */}
                    <div className="sync-affirmation">
                        <Sparkles size={20} />
                        <p>You're tuning into harmony</p>
                    </div>

                    {/* Energy Cord Visualization */}
                    <div className="visualization-container">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={300}
                            className="energy-canvas"
                        />
                    </div>

                    {/* Breathing Guide */}
                    <div className="breathing-guide">
                        <div className={`breath-circle ${breathPhase}`}>
                            <span className="breath-label">{breathPhase}</span>
                            <span className="breath-count">{breathCount}</span>
                        </div>
                    </div>

                    {/* Shared Intention Display */}
                    {sharedIntention && (
                        <div className="intention-display">
                            "{sharedIntention}"
                        </div>
                    )}

                    {/* Controls */}
                    <div className="sync-controls">
                        <button
                            className="control-btn"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                        </button>
                        <button
                            className="end-sync-btn"
                            onClick={handleEndSync}
                        >
                            End Sync
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // POST-SESSION VIEW
    if (sessionState === 'post') {
        return (
            <div className="partner-sync-page post">
                <div className="post-sync-content">
                    <div className="completion-icon">
                        <Heart size={64} />
                    </div>
                    <h1>Sync Complete</h1>
                    <p className="sync-subtitle">You've created a moment of connection</p>

                    <div className="session-summary">
                        <div className="summary-stat">
                            <span className="stat-value">{formatTime(sessionTime)}</span>
                            <span className="stat-label">Duration</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-value">{syncGoals.find(g => g.id === syncGoal)?.label}</span>
                            <span className="stat-label">Goal</span>
                        </div>
                    </div>

                    {/* Journal Moment */}
                    <div className="journal-section">
                        <h3>Reflect on this moment</h3>
                        <textarea
                            className="reflection-input"
                            placeholder="How do you feel? What shifted?"
                            value={myReflection}
                            onChange={(e) => setMyReflection(e.target.value)}
                            maxLength={300}
                        />

                        <label className="share-toggle">
                            <input
                                type="checkbox"
                                checked={shareReflection}
                                onChange={(e) => setShareReflection(e.target.checked)}
                            />
                            <span>
                                {shareReflection ? <Eye size={16} /> : <EyeOff size={16} />}
                                {shareReflection ? 'Share with partner' : 'Keep private'}
                            </span>
                        </label>
                    </div>

                    <div className="milestone-badge">
                        <Sparkles size={20} />
                        <span>This moment has been saved to your Connection Archive</span>
                    </div>

                    <button className="return-btn" onClick={onBack}>
                        Return to Connections
                    </button>
                </div>
            </div>
        );
    }

    // Default fallback
    return (
        <div className="partner-sync-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back
            </button>
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        </div>
    );
}
