import { useState, useEffect, useRef } from 'react';
import { Sliders, Volume2, Zap, Wind, Music, Play, Pause, Save, ListPlus, Plus, X, Headphones, Speaker, Palette, Waves } from 'lucide-react';
import './CustomGenerator.css';

export function CustomGenerator({ onGenerate, isActive, actionLabel }) {
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

    const handleGenerate = () => {
        // Use the first layer as the primary binaural beat
        const primaryLayer = frequencyLayers[0];

        onGenerate({
            id: 'custom-combined',
            title: soundName || 'Custom Sound Mix',
            beat: primaryLayer.beatFreq,
            left: primaryLayer.carrierFreq,
            right: primaryLayer.carrierFreq + primaryLayer.beatFreq,
            bothEars: bothEarsFreq,
            noiseType: selectedNoise !== 'none' ? selectedNoise : null,
            type: selectedScape !== 'none' ? selectedScape : null,
            desc: buildDescription(),
            // Pass volume controls
            volumes: {
                binaural: primaryLayer.volume,
                bothEars: bothEarsVolume,
                noise: noiseVolume,
                soundscape: scapeVolume
            },
            layers: frequencyLayers
        });
    };

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
        return parts.join(' + ') || 'Custom mix';
    };

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
                            Pause Session
                        </>
                    ) : (
                        <>
                            {actionLabel === 'Set Session Sound' ? <Save size={24} /> : <Play size={24} />}
                            {actionLabel || 'Generate & Play'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
