import { ArrowLeft, Play, Pause } from 'lucide-react';
import { colorNoises } from '../data/colorNoises';
import './ColorNoisesPage.css';

export function ColorNoisesPage({ onBack, onPlay, currentTrack, isPlaying }) {
    return (
        <div className="color-noises-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <div className="best-results-banner">
                ✨ For best results: lower volume, silent mode OFF, wear headphones 🎧
            </div>

            <h1 className="page-title">Color Noise Spectrum</h1>
            <p className="page-subtitle">Explore the full spectrum of sonic colors for healing, focus, and sleep.</p>

            <div className="noises-grid">
                {colorNoises.map(noise => {
                    const isActive = currentTrack?.id === noise.id;

                    return (
                        <div key={noise.id} className={`noise-card ${isActive ? 'active' : ''}`}>
                            <div className="noise-header">
                                <h2 className="noise-title">{noise.title}</h2>
                                <button
                                    className={`play-button ${isActive && isPlaying ? 'playing' : ''}`}
                                    onClick={() => onPlay(noise)}
                                >
                                    {isActive && isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                </button>
                            </div>

                            {noise.sound && (
                                <div className="noise-sound">
                                    <strong>Sound:</strong> {noise.sound}
                                </div>
                            )}

                            {noise.profile && (
                                <div className="noise-profile">
                                    <strong>Frequency profile:</strong> {noise.profile}
                                </div>
                            )}

                            <div className="noise-effects">
                                <strong>Effects:</strong>
                                <ul>
                                    {noise.effects.map((effect, idx) => (
                                        <li key={idx}>{effect}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="noise-usage">
                                <strong>Use for:</strong> {noise.usage}
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer className="page-footer">
                <div>OMNISYNC™</div>
                <div>© NeoTheory Music 2025</div>
            </footer>
        </div>
    );
}
