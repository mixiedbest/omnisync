import { useState } from 'react';
import { Sliders } from 'lucide-react';
import './CustomGenerator.css';

export function CustomGenerator({ onGenerate, isActive }) {
    const [carrierFreq, setCarrierFreq] = useState(200);
    const [beatFreq, setBeatFreq] = useState(10);
    const [bothEarsFreq, setBothEarsFreq] = useState(0);
    const [selectedNoise, setSelectedNoise] = useState('none');
    const [selectedScape, setSelectedScape] = useState('none');

    const leftFreq = carrierFreq;
    const rightFreq = carrierFreq + beatFreq;

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
        { value: 'firewood', label: 'Crackling Fire' },
        { value: 'nature-walk', label: 'Nature Walk' },
        { value: 'japanese-garden', label: 'Japanese Garden' },
        { value: 'thunder', label: 'Distant Thunder' },
        { value: 'waterfall', label: 'Waterfall' },
        { value: 'cat-purr', label: 'Cat Purr' },
        { value: 'in-utero', label: 'In Utero' },
        { value: 'underwater', label: 'Underwater' }
    ];

    const handleGenerate = () => {
        onGenerate({
            id: 'custom-combined',
            title: 'Custom Sound Mix',
            beat: beatFreq,
            left: leftFreq,
            right: rightFreq,
            bothEars: bothEarsFreq,
            noiseType: selectedNoise !== 'none' ? selectedNoise : null,
            type: selectedScape !== 'none' ? selectedScape : null,
            desc: buildDescription()
        });
    };

    const buildDescription = () => {
        const parts = [];
        if (beatFreq > 0) parts.push(`${beatFreq} Hz binaural beat`);
        if (bothEarsFreq > 0) parts.push(`${bothEarsFreq} Hz both ears`);
        if (selectedNoise !== 'none') parts.push(`${selectedNoise} noise`);
        if (selectedScape !== 'none') parts.push(scapeOptions.find(s => s.value === selectedScape)?.label);
        return parts.join(' + ') || 'Custom mix';
    };

    return (
        <div className="custom-generator glass-card">
            <div className="generator-header">
                <Sliders size={20} className="generator-icon" />
                <h3 className="generator-title">Sound Mixer</h3>
            </div>

            <div className="generator-content">
                {/* Binaural Beat Section */}
                <div className="mixer-section">
                    <div className="section-title">🎧 Binaural Beat</div>

                    <div className="input-group">
                        <label htmlFor="carrier-freq">Carrier Frequency (Hz)</label>
                        <input
                            id="carrier-freq"
                            type="number"
                            min="20"
                            max="1000"
                            step="0.1"
                            value={carrierFreq}
                            onChange={(e) => setCarrierFreq(parseFloat(e.target.value) || 0)}
                            className="freq-input"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="beat-freq">Binaural Beat (Hz)</label>
                        <input
                            id="beat-freq"
                            type="number"
                            min="0.1"
                            max="40"
                            step="0.1"
                            value={beatFreq}
                            onChange={(e) => setBeatFreq(parseFloat(e.target.value) || 0)}
                            className="freq-input"
                        />
                    </div>

                    <div className="beat-display">
                        <div className="freq-breakdown">
                            <div className="breakdown-item">
                                <span className="breakdown-label">Left:</span>
                                <span className="breakdown-value">{leftFreq.toFixed(1)} Hz</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="breakdown-label">Right:</span>
                                <span className="breakdown-value">{rightFreq.toFixed(1)} Hz</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Both Ears Section */}
                <div className="mixer-section">
                    <div className="section-title">🔊 Both Ears Layer (Optional)</div>
                    <div className="input-group full-width">
                        <label htmlFor="both-freq">
                            Frequency (Both Ears)
                            <span className="optional-label">— Set to 0 to disable</span>
                        </label>
                        <input
                            id="both-freq"
                            type="number"
                            min="0"
                            max="1000"
                            step="0.1"
                            value={bothEarsFreq}
                            onChange={(e) => setBothEarsFreq(parseFloat(e.target.value) || 0)}
                            className="freq-input"
                        />
                    </div>
                </div>

                {/* Color Noise Section */}
                <div className="mixer-section">
                    <div className="section-title">🌈 Background Color Noise</div>
                    <select
                        value={selectedNoise}
                        onChange={(e) => setSelectedNoise(e.target.value)}
                        className="mixer-select"
                    >
                        {noiseOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Soundscape Section */}
                <div className="mixer-section">
                    <div className="section-title">🌊 Ambient Soundscape</div>
                    <select
                        value={selectedScape}
                        onChange={(e) => setSelectedScape(e.target.value)}
                        className="mixer-select"
                    >
                        {scapeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <button
                    className={`generate-btn ${isActive ? 'active' : ''}`}
                    onClick={handleGenerate}
                >
                    {isActive ? '▶ Playing Mix' : '▶ Generate & Play'}
                </button>
            </div>
        </div>
    );
}
