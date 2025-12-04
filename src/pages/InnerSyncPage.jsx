import { useState, useEffect } from 'react';
import { ArrowLeft, User, Sparkles, BookOpen, Activity, Heart, Brain, Zap, Star } from 'lucide-react';
import './InnerSyncPage.css';

export function InnerSyncPage({ onBack, onPlay, currentTrack, isPlaying }) {
    const [username, setUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [activeTab, setActiveTab] = useState('aura-scan'); // 'aura-scan', 'favorites', 'journal', 'energy-profile'

    // Aura Scan State
    const [currentEmotion, setCurrentEmotion] = useState('');
    const [desiredEmotion, setDesiredEmotion] = useState('');
    const [physicalSymptoms, setPhysicalSymptoms] = useState([]);

    // Favorites State
    const [favorites, setFavorites] = useState([]);

    // Journal State
    const [journalEntries, setJournalEntries] = useState([]);
    const [showJournalPrompt, setShowJournalPrompt] = useState(false);

    useEffect(() => {
        // Load username from localStorage
        const savedUsername = localStorage.getItem('omnisync_username');
        if (savedUsername) {
            setUsername(savedUsername);
            setHasUsername(true);
        }

        // Load favorites
        const savedFavorites = localStorage.getItem('omnisync_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        // Load journal entries
        const savedEntries = localStorage.getItem('omnisync_journal');
        if (savedEntries) {
            setJournalEntries(JSON.parse(savedEntries));
        }
    }, []);

    const generateRandomUsername = () => {
        const adjectives = [
            'Cosmic', 'Radiant', 'Serene', 'Luminous', 'Ethereal', 'Tranquil',
            'Vibrant', 'Harmonic', 'Celestial', 'Peaceful', 'Mystic', 'Sacred',
            'Divine', 'Infinite', 'Stellar', 'Quantum', 'Resonant', 'Flowing'
        ];
        const nouns = [
            'Soul', 'Spirit', 'Heart', 'Mind', 'Aura', 'Energy', 'Vibe',
            'Frequency', 'Wave', 'Light', 'Being', 'Essence', 'Flow', 'Pulse',
            'Rhythm', 'Harmony', 'Seeker', 'Dreamer'
        ];

        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj}${noun}`;
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
        const isFavorited = favorites.some(f => f.id === preset.id);
        let updatedFavorites;

        if (isFavorited) {
            updatedFavorites = favorites.filter(f => f.id !== preset.id);
        } else {
            updatedFavorites = [...favorites, preset];
        }

        setFavorites(updatedFavorites);
        localStorage.setItem('omnisync_favorites', JSON.stringify(updatedFavorites));
    };

    const emotions = [
        { value: 'anxious', label: 'Anxious', icon: '😰', freq: { left: 200, right: 210, beat: 10 } },
        { value: 'stressed', label: 'Stressed', icon: '😫', freq: { left: 200, right: 208, beat: 8 } },
        { value: 'sad', label: 'Sad', icon: '😢', freq: { left: 200, right: 206, beat: 6 } },
        { value: 'tired', label: 'Tired', icon: '😴', freq: { left: 200, right: 204, beat: 4 } },
        { value: 'neutral', label: 'Neutral', icon: '😐', freq: { left: 200, right: 210, beat: 10 } },
        { value: 'calm', label: 'Calm', icon: '😌', freq: { left: 200, right: 208, beat: 8 } },
        { value: 'happy', label: 'Happy', icon: '😊', freq: { left: 200, right: 212, beat: 12 } },
        { value: 'energized', label: 'Energized', icon: '⚡', freq: { left: 200, right: 220, beat: 20 } },
        { value: 'focused', label: 'Focused', icon: '🎯', freq: { left: 200, right: 214, beat: 14 } },
        { value: 'creative', label: 'Creative', icon: '🎨', freq: { left: 200, right: 210, beat: 10 } },
    ];

    const symptoms = [
        { value: 'headache', label: 'Headache', icon: '🤕' },
        { value: 'tension', label: 'Muscle Tension', icon: '💪' },
        { value: 'insomnia', label: 'Insomnia', icon: '🌙' },
        { value: 'fatigue', label: 'Fatigue', icon: '😴' },
        { value: 'racing-thoughts', label: 'Racing Thoughts', icon: '🌀' },
        { value: 'low-energy', label: 'Low Energy', icon: '🔋' },
        { value: 'restlessness', label: 'Restlessness', icon: '🌊' },
        { value: 'brain-fog', label: 'Brain Fog', icon: '☁️' },
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

        const current = emotions.find(e => e.value === currentEmotion);
        const desired = emotions.find(e => e.value === desiredEmotion);

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
            title: `${current.label} → ${desired.label}`,
            desc: `Personalized Aura Scan: Transitioning from ${current.label} to ${desired.label}`,
            left: 200,
            right: 200 + adjustedBeat,
            beat: adjustedBeat,
            noiseType: physicalSymptoms.includes('headache') ? 'pink' : null,
            type: physicalSymptoms.includes('tension') ? 'ocean' : null
        };

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
                    className={`tab-btn ${activeTab === 'aura-scan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('aura-scan')}
                >
                    <Sparkles size={18} />
                    Aura Scan
                </button>
                <button
                    className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <Star size={18} />
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
                    className={`tab-btn ${activeTab === 'energy-profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('energy-profile')}
                >
                    <Activity size={18} />
                    Energy Profile
                </button>
            </div>

            {activeTab === 'aura-scan' && (
                <div className="aura-scan-container">
                    <div className="scan-section">
                        <h3 className="section-title">
                            <Heart size={20} />
                            How are you feeling right now?
                        </h3>
                        <div className="emotion-grid">
                            {emotions.map(emotion => (
                                <button
                                    key={emotion.value}
                                    className={`emotion-card ${currentEmotion === emotion.value ? 'selected' : ''}`}
                                    onClick={() => setCurrentEmotion(emotion.value)}
                                >
                                    <span className="emotion-icon">{emotion.icon}</span>
                                    <span className="emotion-label">{emotion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="scan-section">
                        <h3 className="section-title">
                            <Zap size={20} />
                            How would you like to feel?
                        </h3>
                        <div className="emotion-grid">
                            {emotions.map(emotion => (
                                <button
                                    key={emotion.value}
                                    className={`emotion-card ${desiredEmotion === emotion.value ? 'selected' : ''}`}
                                    onClick={() => setDesiredEmotion(emotion.value)}
                                >
                                    <span className="emotion-icon">{emotion.icon}</span>
                                    <span className="emotion-label">{emotion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="scan-section">
                        <h3 className="section-title">
                            <Brain size={20} />
                            Physical Symptoms (Optional)
                        </h3>
                        <div className="symptoms-grid">
                            {symptoms.map(symptom => (
                                <button
                                    key={symptom.value}
                                    className={`symptom-card ${physicalSymptoms.includes(symptom.value) ? 'selected' : ''}`}
                                    onClick={() => toggleSymptom(symptom.value)}
                                >
                                    <span className="symptom-icon">{symptom.icon}</span>
                                    <span className="symptom-label">{symptom.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="generate-scan-btn"
                        onClick={generateAuraScan}
                        disabled={!currentEmotion || !desiredEmotion}
                    >
                        <Sparkles size={20} />
                        Generate Your Healing Frequency
                    </button>
                </div>
            )}

            {activeTab === 'favorites' && (
                <div className="favorites-container">
                    <h3 className="section-title">Your Favorite Frequencies</h3>
                    <p className="favorites-subtitle">Quick access to your most-used healing sounds</p>

                    {favorites.length === 0 ? (
                        <div className="empty-favorites">
                            <Star size={48} />
                            <p>No favorites yet</p>
                            <p className="empty-subtitle">Star your favorite frequencies to save them here</p>
                        </div>
                    ) : (
                        <div className="favorites-grid">
                            {favorites.map((fav, index) => (
                                <div key={index} className="favorite-card">
                                    <div className="favorite-header">
                                        <h4>{fav.title}</h4>
                                        <button
                                            className="unfavorite-btn"
                                            onClick={() => toggleFavorite(fav)}
                                            title="Remove from favorites"
                                        >
                                            <Star size={20} fill="var(--accent-teal)" />
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
                    )}
                </div>
            )}

            {activeTab === 'journal' && (
                <div className="journal-container">
                    <h3 className="section-title">Your Sonic Healing Archive</h3>
                    <p className="journal-subtitle">Track your journey and discover patterns</p>

                    {journalEntries.length === 0 ? (
                        <div className="empty-journal">
                            <BookOpen size={48} />
                            <p>No entries yet. Start your first session to begin logging!</p>
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
            )}

            {activeTab === 'energy-profile' && (
                <div className="energy-profile-container">
                    <h3 className="section-title">Your Energy Profile</h3>
                    <p className="coming-soon">Energy profiles coming soon...</p>
                </div>
            )}
        </div>
    );
}
