import { useState, useEffect, useRef } from 'react';
import { Sliders, Volume2, Zap, Wind, Music, Play, Pause, Save, ListPlus, Plus, X, Headphones, Speaker, Palette, Waves } from 'lucide-react';
import './CustomGenerator.css';

export function CustomGenerator({ onGenerate, isActive, actionLabel, onPause, onOpenTinnitusTherapy }) {
    // Frequency Layers (can add multiple)
    const [frequencyLayers, setFrequencyLayers] = useState([
        { id: 1, carrierFreq: 200, beatFreq: 10, volume: 0.7 }
    ]);

    const [soundName, setSoundName] = useState('');
    const [bothEarsFreq, setBothEarsFreq] = useState(0);
    const [bothEarsVolume, setBothEarsVolume] = useState(0.5);
    const [selectedNoise, setSelectedNoise] = useState('none');
    const [noiseVolume, setNoiseVolume] = useState(0.3);
    const [selectedScape, setSelectedScape] = useState('none');
    const [scapeVolume, setScapeVolume] = useState(0.4);

    // Golden Ratio Explorer
    const PHI = 1.618033988749;
    const [goldenBaseFreq, setGoldenBaseFreq] = useState(432);
    const [showGoldenExplorer, setShowGoldenExplorer] = useState(false);

    const noiseOptions = [
        { value: 'none', label: 'None' },
        { value: 'white', label: 'White Noise' },
        { value: 'pink', label: 'Pink Noise' },
        { value: 'brown', label: 'Brown Noise' },
        { value: 'blue', label: 'Blue Noise' },
        { value: 'violet', label: 'Violet Noise' },
        { value: 'green', label: 'Green Noise' },
        { value: 'grey', label: 'Grey Noise' }
    ];

    const scapeOptions = [
        { value: 'none', label: 'None' },
        { value: 'ocean', label: 'Ocean Waves' },
        { value: 'rain', label: 'Gentle Rain' },
        { value: 'thunder', label: 'Distant Thunder' },
        { value: 'waterfall', label: 'Waterfall' },
        { value: 'cat-purr', label: 'Cat Purr' },
        { value: 'in-utero', label: 'In Utero' },
        { value: 'underwater', label: 'Underwater' },
        { value: 'wind', label: 'Wind' },
        { value: 'cosmic', label: 'Cosmic Space' },
        { value: 'earth', label: 'Earth Resonance' }
    ];

    const addFrequencyLayer = () => {
        const newId = Math.max(...frequencyLayers.map(l => l.id), 0) + 1;
        setFrequencyLayers([...frequencyLayers, {
            id: newId,
            carrierFreq: 200,
            beatFreq: 10,
            volume: 0.7
        }]);
    };

    const removeFrequencyLayer = (id) => {
        if (frequencyLayers.length > 1) {
            setFrequencyLayers(frequencyLayers.filter(l => l.id !== id));
        }
    };

    const updateLayer = (id, field, value) => {
        setFrequencyLayers(frequencyLayers.map(layer =>
            layer.id === id ? { ...layer, [field]: parseFloat(value) || 0 } : layer
        ));
    };



    const getSoundObject = () => {
        const primaryLayer = frequencyLayers[0];
        return {
            id: 'custom-combined',
            title: soundName || 'Custom Sound Mix',
            beat: primaryLayer.beatFreq,
            left: primaryLayer.carrierFreq,
            right: primaryLayer.carrierFreq + primaryLayer.beatFreq,
            bothEars: bothEarsFreq,
            noiseType: selectedNoise !== 'none' ? selectedNoise : null,
            type: selectedScape !== 'none' ? selectedScape : null,
            desc: buildDescription(),
            volumes: {
                binaural: primaryLayer.volume,
                bothEars: bothEarsVolume,
                noise: noiseVolume,
                soundscape: scapeVolume
            },
            layers: frequencyLayers
        };
    };

    const handleGenerate = () => {
        if (isActive && onPause) {
            onPause();
            return;
        }
        onGenerate(getSoundObject());
    };

    // Real-time update effect
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                onGenerate(getSoundObject());
            }, 50); // Fast debounce for smooth slider drag
            return () => clearTimeout(timer);
        }
    }, [frequencyLayers, bothEarsFreq, bothEarsVolume, selectedNoise, noiseVolume, selectedScape, scapeVolume, isActive]);


    const saveCustomSound = () => {
        if (!soundName.trim()) {
            alert('Please give your sound a name first!');
            return;
        }

        const primaryLayer = frequencyLayers[0];
        const soundToSave = {
            id: `custom - ${Date.now()} `,
            title: soundName,
            beat: primaryLayer.beatFreq,
            left: primaryLayer.carrierFreq,
            right: primaryLayer.carrierFreq + primaryLayer.beatFreq,
            bothEars: bothEarsFreq,
            noiseType: selectedNoise !== 'none' ? selectedNoise : null,
            type: selectedScape !== 'none' ? selectedScape : null,
            desc: buildDescription(),
            volumes: {
                binaural: primaryLayer.volume,
                bothEars: bothEarsVolume,
                noise: noiseVolume,
                soundscape: scapeVolume
            },
            layers: frequencyLayers,
            savedAt: new Date().toISOString()
        };

        // Load existing saved sounds
        const savedSounds = JSON.parse(localStorage.getItem('omnisync_custom_sounds') || '[]');

        // Add new sound
        savedSounds.push(soundToSave);

        // Save back to localStorage
        localStorage.setItem('omnisync_custom_sounds', JSON.stringify(savedSounds));

        alert(`✨ "${soundName}" saved to your profile!`);
        setSoundName(''); // Clear the name field
    };

    const buildDescription = () => {
        const parts = [];
        frequencyLayers.forEach((layer, idx) => {
            if (layer.beatFreq > 0) parts.push(`Layer ${idx + 1}: ${layer.beatFreq} Hz`);
        });
        if (bothEarsFreq > 0) parts.push(`${bothEarsFreq} Hz both ears`);
        if (selectedNoise !== 'none') parts.push(`${selectedNoise} noise`);
        if (selectedScape !== 'none') parts.push(scapeOptions.find(s => s.value === selectedScape)?.label);
        return parts.join('. ');
    };

    // Golden Ratio Helper Functions
    const calculatePhiHarmonics = (baseFreq) => {
        return {
            base: baseFreq,
            phiUp1: Math.round(baseFreq * PHI * 10) / 10,
            phiUp2: Math.round(baseFreq * PHI * PHI * 10) / 10,
            phiDown1: Math.round((baseFreq / PHI) * 10) / 10,
            phiDown2: Math.round((baseFreq / PHI / PHI) * 10) / 10
        };
    };

    const applyGoldenHarmonic = (freq) => {
        setFrequencyLayers([{
            id: 1,
            carrierFreq: freq,
            beatFreq: 0,
            volume: 0.7
        }]);
    };

    const applyGoldenPair = (base, phi) => {
        setFrequencyLayers([
            {
                id: 1,
                carrierFreq: base,
                beatFreq: 0,
                volume: 0.7
            },
            {
                id: 2,
                carrierFreq: phi,
                beatFreq: 0,
                volume: 0.4
            }
        ]);
    };

    const goldenHarmonics = calculatePhiHarmonics(goldenBaseFreq);

    return (
        <div className="custom-generator glass-card">
            <div className="generator-header">
                <Sliders size={20} className="generator-icon" />
                <h3 className="generator-title">Advanced Sound Mixer</h3>
            </div>

            <div className="generator-content">
                {/* Frequency Layers */}
                <div className="mixer-section">
                    <div className="section-title-with-action">
                        <span className="section-label"><Headphones size={18} /> Binaural Beat Layers</span>
                        <button className="add-layer-btn" onClick={addFrequencyLayer}>
                            <Plus size={16} /> Add Layer
                        </button>
                    </div>

                    {frequencyLayers.map((layer, index) => (
                        <div key={layer.id} className="frequency-layer">
                            <div className="layer-header">
                                <span className="layer-number">Layer {index + 1}</span>
                                {frequencyLayers.length > 1 && (
                                    <button
                                        className="remove-layer-btn"
                                        onClick={() => removeFrequencyLayer(layer.id)}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="layer-controls">
                                <div className="input-group">
                                    <label>Carrier (Hz)</label>
                                    <input
                                        type="number"
                                        min="20"
                                        max="1000"
                                        step="0.1"
                                        value={layer.carrierFreq}
                                        onChange={(e) => updateLayer(layer.id, 'carrierFreq', e.target.value)}
                                        className="freq-input-small"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Beat (Hz)</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        max="40"
                                        step="0.1"
                                        value={layer.beatFreq}
                                        onChange={(e) => updateLayer(layer.id, 'beatFreq', e.target.value)}
                                        className="freq-input-small"
                                    />
                                </div>

                                <div className="input-group volume-group">
                                    <label>Volume: {Math.round(layer.volume * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={layer.volume}
                                        onChange={(e) => updateLayer(layer.id, 'volume', e.target.value)}
                                        className="volume-slider"
                                    />
                                </div>
                            </div>

                            <div className="beat-display-small">
                                <span>L: {layer.carrierFreq.toFixed(1)} Hz</span>
                                <span>R: {(layer.carrierFreq + layer.beatFreq).toFixed(1)} Hz</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Both Ears Section */}
                <div className="mixer-section">
                    <div className="section-title"><Speaker size={18} /> Both Ears Layer (Optional)</div>
                    <div className="layer-controls">
                        <div className="input-group">
                            <label>Frequency (Hz)</label>
                            <input
                                type="number"
                                min="0"
                                max="1000"
                                step="0.1"
                                value={bothEarsFreq}
                                onChange={(e) => setBothEarsFreq(parseFloat(e.target.value) || 0)}
                                className="freq-input-small"
                            />
                        </div>

                        {bothEarsFreq > 0 && (
                            <div className="input-group volume-group">
                                <label>Volume: {Math.round(bothEarsVolume * 100)}%</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={bothEarsVolume}
                                    onChange={(e) => setBothEarsVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Color Noise Section */}
                <div className="mixer-section">
                    <div className="section-title"><Palette size={18} /> Background Color Noise</div>
                    <select
                        value={selectedNoise}
                        onChange={(e) => setSelectedNoise(e.target.value)}
                        className="mixer-select"
                    >
                        {noiseOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {selectedNoise !== 'none' && (
                        <div className="volume-control">
                            <label>Volume: {Math.round(noiseVolume * 100)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={noiseVolume}
                                onChange={(e) => setNoiseVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                    )}
                </div>

                {/* Soundscape Section */}
                <div className="mixer-section">
                    <div className="section-title"><Waves size={18} /> Ambient Soundscape</div>
                    <select
                        value={selectedScape}
                        onChange={(e) => setSelectedScape(e.target.value)}
                        className="mixer-select"
                    >
                        {scapeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {selectedScape !== 'none' && (
                        <div className="volume-control">
                            <label>Volume: {Math.round(scapeVolume * 100)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={scapeVolume}
                                onChange={(e) => setScapeVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                    )}
                </div>

                {/* Name and Save Section */}
                <div className="save-section">
                    <label className="save-label">
                        <Save size={16} />
                        Name Your Sound (to save to profile)
                    </label>
                    <div className="save-sound-group">
                        <div className="save-input-wrapper">
                            <input
                                type="text"
                                className="save-sound-input"
                                placeholder="Name your mix..."
                                value={soundName}
                                onChange={(e) => setSoundName(e.target.value)}
                            />
                            <button
                                className="save-sound-btn"
                                onClick={saveCustomSound}
                                disabled={!soundName.trim()}
                                title="Save to Profile"
                            >
                                <Save size={20} />
                            </button>
                            <button
                                className="save-sound-btn playlist-add-btn"
                                onClick={() => {
                                    // Logic to open playlist selection modal would go here
                                    // For now, we'll just alert or simulate adding to a default playlist
                                    alert("Added to your 'My Mixes' playlist!");
                                }}
                                disabled={!soundName.trim()}
                                title="Add to Playlist"
                            >
                                <ListPlus size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    className={`generate-btn ${isActive ? 'playing' : ''}`}
                    onClick={handleGenerate}
                >
                    {isActive ? (
                        <>
                            <Pause size={24} />
                            Pause Layer
                        </>
                    ) : (
                        <>
                            {actionLabel === 'Set Session Sound' ? <Save size={24} /> : <Play size={24} />}
                            {actionLabel || 'Generate & Play'}
                        </>
                    )}
                </button>

                {onOpenTinnitusTherapy && (
                    <button
                        className="tinnitus-therapy-btn"
                        onClick={onOpenTinnitusTherapy}
                        title="Customize Tinnitus Relief"
                    >
                        <Headphones size={20} />
                        Tinnitus Relief Therapy
                    </button>
                )}

                <button
                    className="golden-ratio-btn"
                    onClick={() => setShowGoldenExplorer(!showGoldenExplorer)}
                    title="Explore Golden Ratio Frequencies"
                >
                    <Zap size={20} />
                    Golden Ratio Explorer (φ)
                </button>
            </div>

            {/* Golden Ratio Explorer Modal */}
            {showGoldenExplorer && (
                <div className="golden-explorer-modal glass-card">
                    <div className="modal-header">
                        <h3>⚛️ Golden Ratio Explorer (φ ≈ 1.618)</h3>
                        <button className="close-modal-btn" onClick={() => setShowGoldenExplorer(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <p className="explorer-desc">
                        Enter any base frequency to see its golden ratio harmonics.
                        φ-scaled frequencies create naturally balanced, organic sound relationships.
                    </p>

                    <div className="golden-input-group">
                        <label>Base Frequency (Hz)</label>
                        <input
                            type="number"
                            min="20"
                            max="2000"
                            step="1"
                            value={goldenBaseFreq}
                            onChange={(e) => setGoldenBaseFreq(Number(e.target.value))}
                            className="freq-input"
                        />
                    </div>

                    <div className="golden-harmonics-grid">
                        <div className="harmonic-card descent">
                            <div className="harmonic-label">φ⁻² (Descent)</div>
                            <div className="harmonic-freq">{goldenHarmonics.phiDown2} Hz</div>
                            <div className="harmonic-desc">Base ÷ φ ÷ φ</div>
                            <button
                                className="apply-btn"
                                onClick={() => {
                                    applyGoldenHarmonic(goldenHarmonics.phiDown2);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Apply
                            </button>
                        </div>

                        <div className="harmonic-card descent">
                            <div className="harmonic-label">φ⁻¹ (Grounding)</div>
                            <div className="harmonic-freq">{goldenHarmonics.phiDown1} Hz</div>
                            <div className="harmonic-desc">Base ÷ φ</div>
                            <button
                                className="apply-btn"
                                onClick={() => {
                                    applyGoldenHarmonic(goldenHarmonics.phiDown1);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Apply
                            </button>
                        </div>

                        <div className="harmonic-card base">
                            <div className="harmonic-label">φ⁰ (Base)</div>
                            <div className="harmonic-freq">{goldenHarmonics.base} Hz</div>
                            <div className="harmonic-desc">Foundation</div>
                            <button
                                className="apply-btn"
                                onClick={() => {
                                    applyGoldenHarmonic(goldenHarmonics.base);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Apply
                            </button>
                        </div>

                        <div className="harmonic-card ascent">
                            <div className="harmonic-label">φ¹ (Heart)</div>
                            <div className="harmonic-freq">{goldenHarmonics.phiUp1} Hz</div>
                            <div className="harmonic-desc">Base × φ</div>
                            <button
                                className="apply-btn"
                                onClick={() => {
                                    applyGoldenHarmonic(goldenHarmonics.phiUp1);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Apply
                            </button>
                        </div>

                        <div className="harmonic-card ascent">
                            <div className="harmonic-label">φ² (Awareness)</div>
                            <div className="harmonic-freq">{goldenHarmonics.phiUp2} Hz</div>
                            <div className="harmonic-desc">Base × φ × φ</div>
                            <button
                                className="apply-btn"
                                onClick={() => {
                                    applyGoldenHarmonic(goldenHarmonics.phiUp2);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="golden-pairs">
                        <div className="pairs-label">Quick Pairs (Base + φ Harmonic)</div>
                        <div className="pairs-grid">
                            <button
                                className="pair-btn"
                                onClick={() => {
                                    applyGoldenPair(goldenHarmonics.base, goldenHarmonics.phiUp1);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Base + φ¹
                            </button>
                            <button
                                className="pair-btn"
                                onClick={() => {
                                    applyGoldenPair(goldenHarmonics.base, goldenHarmonics.phiUp2);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                Base + φ²
                            </button>
                            <button
                                className="pair-btn"
                                onClick={() => {
                                    applyGoldenPair(goldenHarmonics.phiDown1, goldenHarmonics.base);
                                    setShowGoldenExplorer(false);
                                }}
                            >
                                φ⁻¹ + Base
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
