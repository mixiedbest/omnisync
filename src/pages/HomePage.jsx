import { Home, Info, Sliders, Music, FileText, CloudRain, Mountain, Sparkles } from 'lucide-react';
import './HomePage.css';

export function HomePage({ onNavigate }) {
    const navItems = [
        {
            id: 'presets',
            title: 'Preset Frequencies',
            icon: Music,
            description: 'Browse our curated frequency library'
        },
        {
            id: 'soundscapes',
            title: 'Soundscapes',
            icon: Mountain,
            description: 'Generative ambient environments'
        },
        {
            id: 'energy-profiles',
            title: 'Energy Profiles',
            icon: Sparkles,
            description: 'Daily tuning rituals (3min/30min)'
        },
        {
            id: 'colors',
            title: 'Color Noises',
            icon: CloudRain,
            description: 'Full spectrum of healing noise colors'
        },
        {
            id: 'custom',
            title: 'Custom Generator',
            icon: Sliders,
            description: 'Create your own frequency combinations'
        },
        {
            id: 'about',
            title: 'About',
            icon: Info,
            description: 'Learn about brainwaves & sound healing'
        },
        {
            id: 'disclaimer',
            title: 'Disclaimer',
            icon: FileText,
            description: 'Important safety information'
        }
    ];

    return (
        <div className="home-page">
            <div className="home-header">
                <img src="/omnisync-logo.png" alt="OMNISYNC" className="home-logo" />
                <p className="home-subtitle">Please put on headphones and enjoy 🎧</p>
            </div>

            <div className="nav-grid">
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className="nav-card glass-card"
                            onClick={() => onNavigate(item.id)}
                        >
                            <Icon size={48} className="nav-icon" />
                            <h2 className="nav-title">{item.title}</h2>
                            <p className="nav-description">{item.description}</p>
                        </button>
                    );
                })}
            </div>

            <footer className="home-footer">
                © NeoTheory Music LLC & Mixie 2025
            </footer>
        </div>
    );
}
