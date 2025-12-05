import { Home, Info, Sliders, Music, FileText, CloudRain, Mountain, Sparkles, Zap, Compass, Star, User, Users, Settings, List } from 'lucide-react';
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
            id: 'cosmic-alignment',
            title: 'Cosmic Alignment',
            icon: Star,
            description: 'Astrology-based sound healing'
        },
        {
            id: 'journeys',
            title: 'Curated Journeys',
            icon: Compass,
            description: 'Multi-phase sound healing experiences'
        },
        {
            id: 'soundscapes',
            title: 'Soundscapes',
            icon: Mountain,
            description: 'Generative ambient environments'
        },
        {
            id: 'playlists',
            title: 'Playlists',
            icon: List,
            description: 'Your saved custom sequences'
        },
        {
            id: 'energy-cleanse',
            title: 'Energy Cleanse',
            icon: Zap,
            description: 'Frequency sweep to clear your field'
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
            id: 'innersync',
            title: 'INNERSYNC',
            icon: User,
            description: 'Your personal sonic healing hub'
        },
        {
            id: 'connections',
            title: 'Connections',
            icon: Users,
            description: 'Your sonic circle & synced sessions'
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

            <div className="settings-link-container">
                <button className="nav-btn profile-btn" onClick={() => onNavigate('profile')}>
                    <User size={20} />
                    Your Profile
                </button>
                <button className="nav-btn settings-btn" onClick={() => onNavigate('settings')}>
                    <Settings size={20} />
                    App Settings
                </button>
            </div>

            <div className="manifestation-link">
                <a
                    href="https://youtu.be/yHfUE7XrcdQ?si=b_m6o1GuLEV_GR92"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anthem-link"
                >
                    ✨ Manifestation Anthem ✨
                </a>
            </div>

            <footer className="home-footer">
                <div>OMNISYNC™</div>
                <div>© NeoTheory Music 2025</div>
            </footer>
        </div>
    );
}
