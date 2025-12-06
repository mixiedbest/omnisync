import { useState } from 'react';
import { X, Volume2, Info } from 'lucide-react';
import './TinnitusTherapy.css';

export function TinnitusTherapy({ onClose, onApply }) {
    const [tinnitusFrequency, setTinnitusFrequency] = useState(4000);
    const [notchWidth, setNotchWidth] = useState(500);
    const [volume, setVolume] = useState(0.3);

    const handleApply = () => {
        onApply({
            frequency: tinnitusFrequency,
            notchWidth: notchWidth,
            volume: volume
        });
        onClose();
    };

    const frequencyRanges = [
        { label: 'Low (1-2 kHz)', value: 1500 },
        { label: 'Mid-Low (2-4 kHz)', value: 3000 },
        { label: 'Mid (4-6 kHz)', value: 5000 },
        { label: 'Mid-High (6-8 kHz)', value: 7000 },
        { label: 'High (8-12 kHz)', value: 10000 },
        { label: 'Very High (12-16 kHz)', value: 14000 }
    ];

    return (
        <div className="tinnitus-overlay">
            <div className="tinnitus-modal">
                <button className="close-tinnitus-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="tinnitus-header">
                    <h2>Notched Noise Therapy</h2>
                    <p className="tinnitus-subtitle">
                        Customize therapy to match your tinnitus frequency
                    </p>
                </div>

                <div className="tinnitus-info">
                    <Info size={16} />
                    <p>
                        This therapy plays white noise with a "notch" (gap) at your tinnitus frequency.
                        Regular use may help reduce tinnitus perception over time.
                    </p>
                </div>

                <div className="tinnitus-controls">
                    {/* Frequency Slider */}
                    <div className="control-group">
                        <label>
                            <span>Tinnitus Frequency</span>
                            <span className="value-display">{tinnitusFrequency} Hz</span>
                        </label>
                        <input
                            type="range"
                            min="1000"
                            max="16000"
                            step="100"
                            value={tinnitusFrequency}
                            onChange={(e) => setTinnitusFrequency(parseInt(e.target.value))}
                            className="frequency-slider"
                        />

                        {/* Quick presets */}
                        <div className="frequency-presets">
                            {frequencyRanges.map((range) => (
                                <button
                                    key={range.value}
                                    className={`preset-btn ${Math.abs(tinnitusFrequency - range.value) < 1000 ? 'active' : ''}`}
                                    onClick={() => setTinnitusFrequency(range.value)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notch Width */}
                    <div className="control-group">
                        <label>
                            <span>Notch Width</span>
                            <span className="value-display">{notchWidth} Hz</span>
                        </label>
                        <input
                            type="range"
                            min="200"
                            max="1000"
                            step="50"
                            value={notchWidth}
                            onChange={(e) => setNotchWidth(parseInt(e.target.value))}
                            className="width-slider"
                        />
                        <p className="control-hint">
                            Wider notch = more aggressive filtering
                        </p>
                    </div>

                    {/* Volume */}
                    <div className="control-group">
                        <label>
                            <span>
                                <Volume2 size={16} />
                                Therapy Volume
                            </span>
                            <span className="value-display">{Math.round(volume * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="volume-slider"
                        />
                        <p className="control-hint">
                            Start low and adjust to comfortable level
                        </p>
                    </div>
                </div>

                <div className="tinnitus-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="apply-btn" onClick={handleApply}>
                        Start Therapy
                    </button>
                </div>

                <div className="tinnitus-tips">
                    <h3>💡 Tips for Best Results</h3>
                    <ul>
                        <li>Use headphones for optimal effect</li>
                        <li>Listen for 30-60 minutes daily</li>
                        <li>Keep volume at comfortable level (not too loud)</li>
                        <li>Be patient - results may take weeks of regular use</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
