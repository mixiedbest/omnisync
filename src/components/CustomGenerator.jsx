import { useState } from 'react';
import { Sliders } from 'lucide-react';
import './CustomGenerator.css';

export function CustomGenerator({ onGenerate, isActive }) {
    const [carrierFreq, setCarrierFreq] = useState(200);
    const [beatFreq, setBeatFreq] = useState(10);
    const [bothEarsFreq, setBothEarsFreq] = useState(0); // 0 means disabled

    const leftFreq = carrierFreq;
    const rightFreq = carrierFreq + beatFreq;

    const handleGenerate = () => {
        onGenerate({
            id: 'custom-combined',
            title: 'Custom Frequency Mix',
            beat: beatFreq,
            left: leftFreq,
            right: rightFreq,
            bothEars: bothEarsFreq,
            desc: `Binaural: ${beatFreq} Hz beat at ${carrierFreq} Hz carrier${bothEarsFreq > 0 ? ` + Both Ears: ${bothEarsFreq} Hz` : ''}`
        });
    };

    return (
        <div className="custom-generator glass-card">
            <div className="generator-header">
                <Sliders size={20} className="generator-icon" />
                <h3 className="generator-title">Custom Frequency Generator</h3>
            </div>

            <div className="generator-content">
                <div className="section-title">Binaural Beat</div>

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

                <div className="section-divider"></div>
                <div className="section-title">Both Ears Layer (Optional)</div>

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

                {bothEarsFreq > 0 && (
                    <div className="beat-display both-ears-display">
                        <div className="monaural-info">
                            <div className="info-text">Playing in both ears simultaneously</div>
                            <div className="freq-large">{bothEarsFreq.toFixed(1)} Hz</div>
                        </div>
                    </div>
                )}

                <button
                    className={`generate-btn ${isActive ? 'active' : ''}`}
                    onClick={handleGenerate}
                >
                    {isActive ? 'Playing Custom' : 'Generate & Play'}
                </button>
            </div>
        </div>
    );
}
