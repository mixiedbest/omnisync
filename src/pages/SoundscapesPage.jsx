import { ArrowLeft, Play, Pause, Sparkles, Mountain, Waves, CloudRain, CircleDot, Hexagon, Disc, Flame, TreePine, Flower2, CloudLightning, Droplets, Heart, Baby, Fish } from 'lucide-react';
import { soundscapes } from '../data/soundscapes';
import './SoundscapesPage.css';

const iconMap = {
    Sparkles,
    Mountain,
    Waves,
    CloudRain,
    CircleDot,
    Diamond: Hexagon,
    Drum: Disc,
    Flame,
    Trees: TreePine,
    Flower: Flower2,
    CloudLightning,
    Droplets,
    Heart,
    Baby,
    Fish
};

export function SoundscapesPage({ onBack, onPlay, currentTrack, isPlaying }) {
    return (
        <div className="soundscapes-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <div className="best-results-banner">
                ✨ Generative Audio: These soundscapes are created in real-time, never looping, always unique. 🎧
            </div>

            <h1 className="page-title">Immersive Soundscapes</h1>
            <p className="page-subtitle">Deep, generative environments for meditation and journeying.</p>

            <div className="soundscapes-grid">
                {soundscapes.map(scape => {
                    const isActive = currentTrack?.id === scape.id;
                    const Icon = iconMap[scape.icon] || Sparkles;

                    return (
                        <div key={scape.id} className={`scape-card ${isActive ? 'active' : ''}`}>
                            <div className="scape-icon-wrapper">
                                <Icon size={48} className="scape-icon" />
                            </div>

                            <div className="scape-content">
                                <h2 className="scape-title">{scape.title}</h2>
                                <p className="scape-desc">{scape.desc}</p>
                            </div>

                            <button
                                className={`play-button-large ${isActive && isPlaying ? 'playing' : ''}`}
                                onClick={() => onPlay(scape)}
                            >
                                {isActive && isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </button>
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
