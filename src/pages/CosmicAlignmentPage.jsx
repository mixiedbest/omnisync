import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Moon, Sun, Users, Heart, Zap, MessageCircle, Sparkles, Plus, X, Play, Pause, Globe } from 'lucide-react';
import { zodiacData, elementProfiles, intentionProfiles, getZodiacSign } from '../data/zodiacData';
import { planetaryFrequencies, getCurrentMoonPhase, zodiacRulers } from '../data/planetaryData';
import './CosmicAlignmentPage.css';

export function CosmicAlignmentPage({ onBack, onPlay, currentTrack, isPlaying }) {
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'relationship', or 'lunar'
    const [currentMoonPhase, setCurrentMoonPhase] = useState(null);

    // Personal State
    const [birthDate, setBirthDate] = useState('');
    const [sunSign, setSunSign] = useState(null);
    const [moonSign, setMoonSign] = useState(null); // User selected
    const [risingSign, setRisingSign] = useState(null); // User selected

    // Relationship State
    const [people, setPeople] = useState([{ id: 1, name: 'Person 1', sign: 'aries' }, { id: 2, name: 'Person 2', sign: 'libra' }]);
    const [intention, setIntention] = useState('romance');

    // Calculate current moon phase on mount
    useEffect(() => {
        setCurrentMoonPhase(getCurrentMoonPhase());
    }, []);

    // --- Personal Logic ---
    const calculateSunSign = (date) => {
        if (!date) return;
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const sign = getZodiacSign(day, month);
        setSunSign(sign.id);
    };

    const handleDateChange = (e) => {
        setBirthDate(e.target.value);
        calculateSunSign(e.target.value);
    };

    const playPersonalProfile = () => {
        if (!sunSign) return;

        // Determine dominant element (simple logic: Sun is 50%, Moon 30%, Rising 20%)
        // For simplicity, we'll base the core sound on the Sun element, 
        // but layer in Moon and Rising if available.

        const sunData = zodiacData[sunSign];
        const sunElement = elementProfiles[sunData.element];

        let title = `Soul Frequency: ${sunData.name} Sun`;
        let desc = sunElement.desc;

        // Base frequencies from Sun Element
        let leftFreq = sunElement.frequencies.base;
        let rightFreq = sunElement.frequencies.base + sunElement.frequencies.binaural;
        let noise = sunElement.noise;
        let soundscape = sunElement.soundscape;

        // If Moon is known, it adds a harmonic layer (handled by 'bothEars' or just conceptually in the mix)
        // In our current audio engine, we can use 'bothEars' for the Moon frequency
        let moonFreq = 0;
        if (moonSign) {
            const moonData = zodiacData[moonSign];
            const moonElement = elementProfiles[moonData.element];
            moonFreq = moonElement.frequencies.base; // Add moon base freq as a layer
            title += ` + ${moonData.name} Moon`;
        }

        onPlay({
            id: `cosmic-personal-${sunSign}`,
            title: title,
            left: leftFreq,
            right: rightFreq,
            bothEars: moonFreq, // Moon layer
            noiseType: noise,
            type: soundscape,
            desc: desc
        });
    };

    // --- Relationship Logic ---
    const addPerson = () => {
        setPeople([...people, { id: Date.now(), name: `Person ${people.length + 1}`, sign: 'aries' }]);
    };

    const removePerson = (id) => {
        if (people.length > 2) {
            setPeople(people.filter(p => p.id !== id));
        }
    };

    const updatePerson = (id, field, value) => {
        setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const playRelationshipHarmonic = () => {
        // 1. Analyze Elements
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };
        people.forEach(p => {
            const sign = zodiacData[p.sign];
            elements[sign.element]++;
        });

        // Find dominant element
        const dominantElementKey = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);
        const domProfile = elementProfiles[dominantElementKey];

        // 2. Apply Intention
        const intentProfile = intentionProfiles[intention];

        // 3. Construct Sound
        // Base: Dominant Element Base Freq
        // Beat: Intention Binaural Beat
        // Layer: Intention Base Freq (as bothEars or harmonic)

        onPlay({
            id: `cosmic-group-${Date.now()}`,
            title: `Group Harmonic: ${domProfile.name} + ${intentProfile.title}`,
            left: domProfile.frequencies.base,
            right: domProfile.frequencies.base + intentProfile.binaural,
            bothEars: intentProfile.base, // Intention layer
            noiseType: domProfile.noise,
            type: domProfile.soundscape,
            desc: `Blending ${people.length} energies with ${intentProfile.title} intention.`
        });
    };

    // --- Lunar & Planetary Logic ---
    const playMoonPhase = () => {
        if (!currentMoonPhase) return;

        onPlay({
            id: `lunar-${currentMoonPhase.id}`,
            title: `${currentMoonPhase.emoji} ${currentMoonPhase.name}`,
            left: currentMoonPhase.frequencies.base,
            right: currentMoonPhase.frequencies.base + currentMoonPhase.frequencies.binaural,
            bothEars: currentMoonPhase.frequencies.harmonics[0], // First harmonic
            noiseType: currentMoonPhase.noise,
            type: currentMoonPhase.soundscape,
            desc: currentMoonPhase.intention
        });
    };

    const playPlanetaryFrequency = (planetId) => {
        const planet = planetaryFrequencies[planetId];

        onPlay({
            id: `planetary-${planetId}`,
            title: `${planet.name} Frequency`,
            left: planet.frequency,
            right: planet.frequency + 7.83, // Add Schumann resonance as binaural
            bothEars: 0,
            noiseType: 'pink',
            type: null,
            desc: `${planet.purpose} • ${planet.chakra} Chakra`
        });
    };

    return (
        <div className="cosmic-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <h1 className="page-title">Cosmic Alignment</h1>
            <p className="page-subtitle">Astrological Sound Healing</p>

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <Star size={16} /> Personal Chart
                </button>
                <button
                    className={`tab-btn ${activeTab === 'relationship' ? 'active' : ''}`}
                    onClick={() => setActiveTab('relationship')}
                >
                    <Users size={16} /> Relationship
                </button>
                <button
                    className={`tab-btn ${activeTab === 'lunar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lunar')}
                >
                    <Moon size={16} /> Lunar & Planetary
                </button>
            </div>

            {activeTab === 'personal' ? (
                <div className="tab-content fade-in">
                    <div className="chart-input-section glass-card">
                        <h3>Your Celestial Signature</h3>

                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={handleDateChange}
                                className="date-input"
                            />
                        </div>

                        <div className="signs-selector">
                            <div className="sign-input">
                                <label><Sun size={16} /> Sun Sign</label>
                                <select value={sunSign || ''} onChange={(e) => setSunSign(e.target.value)}>
                                    <option value="" disabled>Select Sign</option>
                                    {Object.values(zodiacData).map(z => (
                                        <option key={z.id} value={z.id}>{z.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sign-input">
                                <label><Moon size={16} /> Moon Sign (Optional)</label>
                                <select value={moonSign || ''} onChange={(e) => setMoonSign(e.target.value)}>
                                    <option value="">Unknown / None</option>
                                    {Object.values(zodiacData).map(z => (
                                        <option key={z.id} value={z.id}>{z.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sign-input">
                                <label><Sparkles size={16} /> Rising Sign (Optional)</label>
                                <select value={risingSign || ''} onChange={(e) => setRisingSign(e.target.value)}>
                                    <option value="">Unknown / None</option>
                                    {Object.values(zodiacData).map(z => (
                                        <option key={z.id} value={z.id}>{z.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {sunSign && (
                            <div className="chart-summary">
                                <div className="element-badge" data-element={zodiacData[sunSign].element}>
                                    {zodiacData[sunSign].element} Element
                                </div>
                                <p>{elementProfiles[zodiacData[sunSign].element].purpose}</p>
                            </div>
                        )}

                        <button
                            className="play-action-btn"
                            disabled={!sunSign}
                            onClick={playPersonalProfile}
                        >
                            {isPlaying && currentTrack?.id.includes('cosmic-personal') ? <Pause size={24} /> : <Play size={24} />}
                            {isPlaying && currentTrack?.id.includes('cosmic-personal') ? 'Pause Soul Frequency' : 'Play Soul Frequency'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="tab-content fade-in">
                    <div className="relationship-builder glass-card">
                        <h3>Group Energy Blend</h3>

                        <div className="people-list">
                            {people.map((person, index) => (
                                <div key={person.id} className="person-row">
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                                        placeholder="Name"
                                        className="name-input"
                                    />
                                    <select
                                        value={person.sign}
                                        onChange={(e) => updatePerson(person.id, 'sign', e.target.value)}
                                        className="sign-select"
                                    >
                                        {Object.values(zodiacData).map(z => (
                                            <option key={z.id} value={z.id}>{z.name}</option>
                                        ))}
                                    </select>
                                    {people.length > 2 && (
                                        <button className="remove-btn" onClick={() => removePerson(person.id)}>
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="add-person-btn" onClick={addPerson}>
                            <Plus size={16} /> Add Person
                        </button>

                        <div className="intention-selector">
                            <h4>Set Intention</h4>
                            <div className="intention-grid">
                                {Object.values(intentionProfiles).map(p => (
                                    <button
                                        key={p.id}
                                        className={`intention-btn ${intention === p.id ? 'active' : ''}`}
                                        onClick={() => setIntention(p.id)}
                                    >
                                        {p.id === 'romance' && <Heart size={16} />}
                                        {p.id === 'healing' && <Sparkles size={16} />}
                                        {p.id === 'communication' && <MessageCircle size={16} />}
                                        {p.id === 'creativity' && <Zap size={16} />}
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="play-action-btn"
                            onClick={playRelationshipHarmonic}
                        >
                            {isPlaying && currentTrack?.id.includes('cosmic-group') ? <Pause size={24} /> : <Play size={24} />}
                            {isPlaying && currentTrack?.id.includes('cosmic-group') ? 'Pause Group Harmony' : 'Generate & Play Harmony'}
                        </button>
                    </div>
                </div>
            ) : activeTab === 'lunar' ? (
            <div className="tab-content fade-in">
                {/* Moon Phase Section */}
                {currentMoonPhase && (
                    <div className="lunar-section glass-card">
                        <h3>🌙 Current Moon Phase</h3>
                        <div className="moon-phase-card">
                            <div className="moon-emoji">{currentMoonPhase.emoji}</div>
                            <h4>{currentMoonPhase.name}</h4>
                            <p className="moon-purpose">{currentMoonPhase.purpose}</p>
                            <p className="moon-intention">{currentMoonPhase.intention}</p>
                            <button
                                className="play-action-btn"
                                onClick={playMoonPhase}
                            >
                                {isPlaying && currentTrack?.id.includes('lunar') ? <Pause size={24} /> : <Play size={24} />}
                                {isPlaying && currentTrack?.id.includes('lunar') ? 'Pause Lunar Frequency' : 'Play Lunar Frequency'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Planetary Frequencies Section */}
                <div className="planetary-section glass-card">
                    <h3>🪐 Planetary Frequencies</h3>
                    <p className="section-subtitle">Tune into the cosmic octave</p>
                    <div className="planetary-grid">
                        {Object.values(planetaryFrequencies).map(planet => (
                            <button
                                key={planet.id}
                                className={`planetary-card ${isPlaying && currentTrack?.id === `planetary-${planet.id}` ? 'active' : ''}`}
                                onClick={() => playPlanetaryFrequency(planet.id)}
                                style={{ borderColor: planet.color }}
                            >
                                <div className="planet-header">
                                    <div className="planet-icon" style={{ background: planet.color }}></div>
                                    <h4>{planet.name}</h4>
                                </div>
                                <div className="planet-freq">{planet.frequency.toFixed(2)} Hz</div>
                                <div className="planet-chakra">{planet.chakra}</div>
                                <p className="planet-purpose">{planet.purpose}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            ) : null}
        </div>
    );
}
