import { useState, useEffect } from 'react';
import { ArrowLeft, User, Sparkles, BookOpen, Activity, Heart, Brain, Zap, Star, Frown, Meh, Smile, Coffee, Battery, BatteryLow, Wind, Cloud, Flame, Moon, Clock, Diamond, Feather, Shield, Palette, Waves, Rocket } from 'lucide-react';
import { energyProfiles } from '../data/energyProfiles';
import './InnerSyncPage.css';

const iconMap = {
    Diamond, Zap, Flame, Heart, Feather, Shield, Palette, Waves, Rocket
};

export function InnerSyncPage({ onBack, onPlay, currentTrack, isPlaying, favorites = [], onToggleFavorite }) {
    const [username, setUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [activeTab, setActiveTab] = useState('energy-profiles'); // 'energy-profiles', 'favorites', 'journal', 'insights'
    const [selectedDuration, setSelectedDuration] = useState('short'); // 'short' or 'long'

    // Aura Scan State Removed

    // Handle Energy Profile Play
    const handlePlayProfile = (profile) => {
        const config = selectedDuration === 'short' ? profile.short : profile.long;
        onPlay({
            id: `energy-${profile.id}-${selectedDuration}`,
            title: `${profile.title} (${selectedDuration === 'short' ? '3 min' : '30 min'})`,
            ...config.frequencies,
            noiseType: config.noiseType,
            type: config.soundscapeType,
            desc: profile.description
        });
    };

    // Journal State
    const [journalEntries, setJournalEntries] = useState([]);
    const [showJournalPrompt, setShowJournalPrompt] = useState(false);
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [todayGratitude, setTodayGratitude] = useState('');
    const [additionalGratitude, setAdditionalGratitude] = useState(['', '', '']);

    useEffect(() => {
        // Load username from localStorage
        const savedUsername = localStorage.getItem('omnisync_username');
        if (savedUsername) {
            setUsername(savedUsername);
            setHasUsername(true);
        }

        // Load journal entries
        const savedEntries = localStorage.getItem('omnisync_journal');
        if (savedEntries) {
            setJournalEntries(JSON.parse(savedEntries));
        }

        // Load gratitude entries
        const savedGratitude = localStorage.getItem('omnisync_gratitude');
        if (savedGratitude) {
            setGratitudeEntries(JSON.parse(savedGratitude));
        }
    }, []);

    const generateRandomUsername = () => {
        const adjectives = [
            'Affectionate', 'Amicable', 'Brave', 'Calm', 'Charismatic', 'Cheerful',
            'Compassionate', 'Confident', 'Courageous', 'Creative', 'Diligent', 'Empathetic',
            'Enthusiastic', 'Friendly', 'Generous', 'Genuine', 'Helpful', 'Honest',
            'Intelligent', 'Loyal', 'Optimistic', 'Passionate', 'Patient', 'Responsible',
            'Skilled', 'Thoughtful', 'Trustworthy', 'Vibrant', 'Witty', 'Bright',
            'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet', 'Turquoise',
            'Radiant', 'Gentle', 'Happy', 'Cosmic', 'Serene', 'Luminous', 'Ethereal',
            'Tranquil', 'Harmonic', 'Celestial', 'Peaceful', 'Mystic', 'Sacred',
            'Divine', 'Infinite', 'Stellar', 'Quantum', 'Resonant', 'Flowing'
        ];
        const nouns = [
            'Love', 'Builder', 'Glow', 'Sparkle', 'Soul', 'Spirit', 'Heart',
            'Mind', 'Aura', 'Energy', 'Vibe', 'Frequency', 'Wave', 'Light',
            'Being', 'Essence', 'Flow', 'Pulse', 'Rhythm', 'Harmony', 'Seeker',
            'Dreamer', 'Healer', 'Guide', 'Warrior', 'Phoenix', 'Star', 'Moon',
            'Sun', 'Ocean', 'Mountain', 'River', 'Forest', 'Sky', 'Dawn'
        ];

        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj}${noun} `;
    };

    const handleRandomUsername = () => {
        const randomName = generateRandomUsername();
        setUsername(randomName);
    };

    const handleSaveUsername = () => {
        if (username.trim()) {
            localStorage.setItem('omnisync_username', username.trim());
            setHasUsername(true);
        }
    };

    const toggleFavorite = (preset) => {
        if (onToggleFavorite) {
            onToggleFavorite(preset);
        }
    };

    const handleSaveGratitude = () => {
        if (!todayGratitude.trim()) return;

        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString(),
            content: todayGratitude,
            extras: additionalGratitude.filter(g => g.trim())
        };

        const updatedGratitude = [newEntry, ...gratitudeEntries];
        setGratitudeEntries(updatedGratitude);
        localStorage.setItem('omnisync_gratitude', JSON.stringify(updatedGratitude));

        setTodayGratitude('');
        setAdditionalGratitude(['', '', '']);
    };

    const currentEmotions = [
        { value: 'anxious', label: 'Anxious', icon: Frown, freq: { left: 200, right: 210, beat: 10 } },
        { value: 'stressed', label: 'Stressed', icon: Zap, freq: { left: 200, right: 208, beat: 8 } },
        { value: 'sad', label: 'Sad', icon: Cloud, freq: { left: 200, right: 206, beat: 6 } },
        { value: 'tired', label: 'Tired', icon: BatteryLow, freq: { left: 200, right: 204, beat: 4 } },
        { value: 'neutral', label: 'Neutral', icon: Meh, freq: { left: 200, right: 210, beat: 10 } },
        { value: 'overwhelmed', label: 'Overwhelmed', icon: Wind, freq: { left: 200, right: 212, beat: 12 } },
        { value: 'restless', label: 'Restless', icon: Flame, freq: { left: 200, right: 215, beat: 15 } },
    ];

    const desiredEmotions = [
        { value: 'calm', label: 'Calm', icon: Wind, freq: { left: 200, right: 208, beat: 8 } },
        { value: 'happy', label: 'Happy', icon: Smile, freq: { left: 200, right: 212, beat: 12 } },
        { value: 'energized', label: 'Energized', icon: Flame, freq: { left: 200, right: 220, beat: 20 } },
        { value: 'focused', label: 'Focused', icon: Sparkles, freq: { left: 200, right: 214, beat: 14 } },
        { value: 'creative', label: 'Creative', icon: Star, freq: { left: 200, right: 210, beat: 10 } },
        { value: 'peaceful', label: 'Peaceful', icon: Heart, freq: { left: 200, right: 206, beat: 6 } },
        { value: 'confident', label: 'Confident', icon: Zap, freq: { left: 200, right: 216, beat: 16 } },
    ];

    const symptoms = [
        { value: 'headache', label: 'Headache', icon: Brain },
        { value: 'tension', label: 'Muscle Tension', icon: Zap },
        { value: 'insomnia', label: 'Insomnia', icon: Moon },
        { value: 'fatigue', label: 'Fatigue', icon: BatteryLow },
        { value: 'racing-thoughts', label: 'Racing Thoughts', icon: Wind },
        { value: 'low-energy', label: 'Low Energy', icon: Battery },
        { value: 'restlessness', label: 'Restlessness', icon: Flame },
        { value: 'brain-fog', label: 'Brain Fog', icon: Cloud },
    ];

    const toggleSymptom = (symptom) => {
        setPhysicalSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const generateAuraScan = () => {
        if (!currentEmotion || !desiredEmotion) return;

        const current = currentEmotions.find(e => e.value === currentEmotion);
        const desired = desiredEmotions.find(e => e.value === desiredEmotion);

        // Create a transitional frequency
        const avgBeat = (current.freq.beat + desired.freq.beat) / 2;

        // Adjust based on symptoms
        let adjustedBeat = avgBeat;
        if (physicalSymptoms.includes('insomnia') || physicalSymptoms.includes('racing-thoughts')) {
            adjustedBeat = Math.max(4, adjustedBeat - 2); // Lower for calming
        }
        if (physicalSymptoms.includes('fatigue') || physicalSymptoms.includes('low-energy')) {
            adjustedBeat = Math.min(20, adjustedBeat + 3); // Higher for energy
        }

        const preset = {
            id: 'aura-scan-custom',
            title: `${current.label} → ${desired.label} `,
            desc: `Personalized Aura Scan: Transitioning from ${current.label} to ${desired.label} `,
            left: 200,
            right: 200 + adjustedBeat,
            beat: adjustedBeat,
            noiseType: physicalSymptoms.includes('headache') ? 'pink' : null,
            type: physicalSymptoms.includes('tension') ? 'ocean' : null
        };

        // Log journal entry
        const newEntry = {
            date: new Date().toLocaleString(),
            frequency: `${adjustedBeat.toFixed(1)} Hz`,
            moodBefore: current.label,
            moodAfter: desired.label,
            symptoms: physicalSymptoms,
            preset: preset
        };

        const updatedEntries = [newEntry, ...journalEntries];
        setJournalEntries(updatedEntries);
        localStorage.setItem('omnisync_journal', JSON.stringify(updatedEntries));

        onPlay(preset);
    };

    if (!hasUsername) {
        return (
            <div className="innersync-page">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="username-setup">
                    <div className="setup-icon">
                        <User size={64} />
                    </div>
                    <h1 className="setup-title">Welcome to INNERSYNC</h1>
                    <p className="setup-subtitle">Create your personal healing identity</p>

                    <div className="username-input-group">
                        <input
                            type="text"
                            className="username-input"
                            placeholder="Choose your username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={20}
                        />
                        <button className="random-btn" onClick={handleRandomUsername}>
                            <Sparkles size={16} />
                            Random
                        </button>
                    </div>

                    <button
                        className="save-username-btn"
                        onClick={handleSaveUsername}
                        disabled={!username.trim()}
                    >
                        Begin Your Journey
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="innersync-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="innersync-header">
                <div className="user-badge">
                    <User size={20} />
                    <span>{username}</span>
                </div>
                <h1 className="page-title">INNERSYNC</h1>
                <p className="page-subtitle">Your Personal Sonic Healing Hub</p>
            </div>

            <div className="innersync-tabs">
                <button
                    className={`tab-btn ${activeTab === 'energy-profiles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('energy-profiles')}
                >
                    <Zap size={18} />
                    Energy Profiles
                </button>
                <button
                    className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <Heart size={18} />
                    Favorites
                </button>
                <button
                    className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('journal')}
                >
                    <BookOpen size={18} />
                    Journal
                </button>
                <button
                    className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                    onClick={() => setActiveTab('insights')}
                >
                    <Activity size={18} />
                    Insights
                </button>
            </div>

            {activeTab === 'energy-profiles' && (
                <div className="energy-profiles-container">
                    <h3 className="section-title">Daily Energy Tuning</h3>
                    <p className="page-subtitle">Today I need...</p>

                    {/* Duration Selector */}
                    <div className="duration-selector" style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                        <button
                            className={`duration-btn ${selectedDuration === 'short' ? 'active' : ''}`}
                            onClick={() => setSelectedDuration('short')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '12px',
                                border: selectedDuration === 'short' ? '1px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedDuration === 'short' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: selectedDuration === 'short' ? 'var(--accent-teal)' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            <Clock size={16} />
                            <span>Quick (3 min)</span>
                        </button>
                        <button
                            className={`duration-btn ${selectedDuration === 'long' ? 'active' : ''}`}
                            onClick={() => setSelectedDuration('long')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '12px',
                                border: selectedDuration === 'long' ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedDuration === 'long' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: selectedDuration === 'long' ? 'var(--accent-purple)' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            <Zap size={16} />
                            <span>Deep (30 min)</span>
                        </button>
                    </div>

                    <div className="profiles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                        {energyProfiles.map(profile => {
                            const isActive = currentTrack?.id === `energy-${profile.id}-${selectedDuration}`;
                            const Icon = iconMap[profile.icon];

                            return (
                                <button
                                    key={profile.id}
                                    className={`profile-card ${isActive ? 'active' : ''}`}
                                    onClick={() => handlePlayProfile(profile)}
                                    style={{
                                        position: 'relative', background: 'rgba(255,255,255,0.05)', border: isActive ? '1px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', minHeight: '160px',
                                        cursor: 'pointer', transition: 'all 0.2s', boxShadow: isActive ? '0 0 20px rgba(20, 184, 166, 0.2)' : 'none'
                                    }}
                                >
                                    <div className={`profile-icon-wrapper`} style={{
                                        width: '48px', height: '48px', borderRadius: '50%', background: `var(--gradient-${profile.color}, #444)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'
                                    }}>
                                        {Icon && <Icon size={24} color="white" />}
                                    </div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0 }}>{profile.title}</h3>
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{profile.description}</p>

                                    {isActive && isPlaying && (
                                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'favorites' && (
                <div className="favorites-container">
                    <h3 className="section-title">Your Favorite Frequencies</h3>
                    <p className="favorites-subtitle">Quick access to your most-used healing sounds</p>

                    {favorites.length === 0 ? (
                        <div className="empty-favorites">
                            <Heart size={48} />
                            <p>No favorites yet</p>
                            <p className="empty-subtitle">Heart your favorite frequencies to save them here</p>
                        </div>
                    ) : (
                        <div className="favorites-groups">
                            {Object.entries(
                                favorites.reduce((acc, fav) => {
                                    let group = 'Other';
                                    if (fav.id && fav.id.startsWith('energy-')) group = 'Energy Profiles';
                                    else if (fav.effects) group = 'Color Noises';
                                    else if (fav.duration) group = 'Journeys';
                                    else if (fav.beat) group = 'Presets';

                                    if (!acc[group]) acc[group] = [];
                                    acc[group].push(fav);
                                    return acc;
                                }, {})
                            ).map(([group, groupFavorites]) => (
                                <div key={group} className="favorites-group">
                                    <h4 className="group-title">{group}</h4>
                                    <div className="favorites-grid">
                                        {groupFavorites.map((fav, index) => (
                                            <div key={index} className="favorite-card">
                                                <div className="favorite-header">
                                                    <h4>{fav.title}</h4>
                                                    <button
                                                        className="unfavorite-btn"
                                                        onClick={() => toggleFavorite(fav)}
                                                        title="Remove from favorites"
                                                    >
                                                        <Heart size={20} fill="var(--accent-teal)" />
                                                    </button>
                                                </div>
                                                <p className="favorite-desc">{fav.desc}</p>
                                                <button
                                                    className="play-favorite-btn"
                                                    onClick={() => onPlay(fav)}
                                                >
                                                    ▶ Play
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'journal' && (
                <div className="journal-container">
                    <h3 className="section-title">Your Sonic Healing Archive</h3>
                    <p className="journal-subtitle">Track your journey and gratitude</p>

                    {/* Daily Gratitude Section */}
                    <div className="gratitude-section">
                        <div className="gratitude-card">
                            <div className="gratitude-header">
                                <Heart size={20} className="gratitude-icon" />
                                <h4>Daily Gratitude</h4>
                            </div>
                            <p className="gratitude-prompt">What is one thing you are grateful for today?</p>

                            <div className="gratitude-input-group">
                                <input
                                    type="text"
                                    className="gratitude-input"
                                    placeholder="I am grateful for..."
                                    value={todayGratitude}
                                    onChange={(e) => setTodayGratitude(e.target.value)}
                                />

                                {additionalGratitude.map((item, index) => (
                                    item !== null && (
                                        <input
                                            key={index}
                                            type="text"
                                            className="gratitude-input extra"
                                            placeholder="Also grateful for..."
                                            value={item}
                                            onChange={(e) => {
                                                const newExtras = [...additionalGratitude];
                                                newExtras[index] = e.target.value;
                                                setAdditionalGratitude(newExtras);
                                            }}
                                        />
                                    )
                                ))}
                            </div>

                            <div className="gratitude-actions">
                                <button
                                    className="add-gratitude-btn"
                                    onClick={() => handleSaveGratitude()}
                                    disabled={!todayGratitude.trim()}
                                >
                                    Log Gratitude
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="journal-history-split">
                        {/* Gratitude History */}
                        <div className="history-column">
                            <h4 className="history-title">Gratitude Log</h4>
                            {gratitudeEntries.length === 0 ? (
                                <p className="empty-text">No gratitude entries yet.</p>
                            ) : (
                                <div className="gratitude-list">
                                    {gratitudeEntries.map(entry => (
                                        <div key={entry.id} className="gratitude-entry-card">
                                            <span className="entry-date-sm">{entry.date}</span>
                                            <p className="gratitude-main">{entry.content}</p>
                                            {entry.extras && entry.extras.length > 0 && (
                                                <ul className="gratitude-extras">
                                                    {entry.extras.map((extra, i) => (
                                                        <li key={i}>{extra}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Session History */}
                        <div className="history-column">
                            <h4 className="history-title">Session Log</h4>
                            {journalEntries.length === 0 ? (
                                <div className="empty-journal">
                                    <BookOpen size={48} />
                                    <p>No sessions yet.</p>
                                </div>
                            ) : (
                                <div className="journal-entries">
                                    {journalEntries.map((entry, index) => (
                                        <div key={index} className="journal-entry">
                                            <div className="entry-header">
                                                <span className="entry-date">{entry.date}</span>
                                                <span className="entry-frequency">{entry.frequency}</span>
                                            </div>
                                            <div className="entry-moods">
                                                <span>Before: {entry.moodBefore}</span>
                                                <span>→</span>
                                                <span>After: {entry.moodAfter}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="energy-profile-container">
                    <h3 className="section-title">Your Insights</h3>
                    <p className="profile-subtitle">Stats & Session History</p>

                    {journalEntries.length === 0 ? (
                        <div className="empty-profile">
                            <Activity size={48} />
                            <p>No data yet</p>
                            <p className="empty-subtitle">Use the Aura Scan to start building your profile</p>
                        </div>
                    ) : (
                        <div className="profile-stats">
                            <div className="stat-box">
                                <div className="stat-icon">📊</div>
                                <div className="stat-value">{journalEntries.length}</div>
                                <div className="stat-label">Total Sessions</div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-icon">✦</div>
                                <div className="stat-value">
                                    {(() => {
                                        const moods = journalEntries.map(e => e.moodBefore);
                                        const moodCounts = {};
                                        moods.forEach(m => moodCounts[m] = (moodCounts[m] || 0) + 1);
                                        return Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || 'N/A';
                                    })()}
                                </div>
                                <div className="stat-label">Most Common Starting Mood</div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-value">
                                    {(() => {
                                        const moods = journalEntries.map(e => e.moodAfter);
                                        const moodCounts = {};
                                        moods.forEach(m => moodCounts[m] = (moodCounts[m] || 0) + 1);
                                        return Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || 'N/A';
                                    })()}
                                </div>
                                <div className="stat-label">Most Desired Mood</div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-icon">🎵</div>
                                <div className="stat-value">
                                    {(() => {
                                        const freqs = journalEntries.map(e => parseFloat(e.frequency));
                                        const avg = freqs.reduce((a, b) => a + b, 0) / freqs.length;
                                        return avg.toFixed(1);
                                    })()} Hz
                                </div>
                                <div className="stat-label">Average Frequency</div>
                            </div>
                        </div>
                    )}

                    {journalEntries.length > 0 && (
                        <div className="recent-sessions">
                            <h4>Recent Sessions</h4>
                            <div className="session-list">
                                {journalEntries.slice(0, 5).map((entry, index) => (
                                    <div key={index} className="session-item">
                                        <div className="session-date">{entry.date}</div>
                                        <div className="session-transition">
                                            {entry.moodBefore} → {entry.moodAfter}
                                        </div>
                                        <div className="session-freq">{entry.frequency}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
