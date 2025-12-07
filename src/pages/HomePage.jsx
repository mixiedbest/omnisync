import { useState, useEffect } from 'react';
import { Home, Info, Sliders, Music, FileText, CloudRain, Mountain, Sparkles, Zap, Compass, Star, User, Users, Settings, List, Moon } from 'lucide-react';
import './HomePage.css';

export function HomePage({ onNavigate }) {
    const [showDreamJournalButton, setShowDreamJournalButton] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('omnisync_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setShowDreamJournalButton(settings.dreamJournalQuickAccess || false);
        }
    }, []);

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
            description: 'Brainwaves, breathing techniques & creators'
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

            {showDreamJournalButton && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    marginTop: '-12px'
                }}>
                    <button
                        className="dream-journal-quick-btn"
                        onClick={() => onNavigate('innersync-dream')}
                        style={{
                            padding: '16px 32px',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            borderRadius: '16px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
                        }}
                    >
                        <Moon size={24} />
                        Dream Journal
                    </button>
                </div>
            )}

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
