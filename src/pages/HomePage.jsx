import { Home, Info, Sliders, Music, FileText, CloudRain } from 'lucide-react';
import './HomePage.css';

export function HomePage({ onNavigate }) {
    const navItems = [
        {
            id: 'presets',
            title: 'Preset Frequencies',
            icon: Music,
            description: 'Browse our curated frequency library',
            color: 'from-pink-900 to-purple-900'
        },
        {
            id: 'colors',
            title: 'Color Noises',
            icon: CloudRain,
            description: 'Full spectrum of healing noise colors',
            color: 'from-indigo-900 to-blue-900'
        },
        {
            id: 'custom',
            title: 'Custom Generator',
            icon: Sliders,
            description: 'Create your own frequency combinations',
            color: 'from-teal-900 to-cyan-900'
        },
        {
            id: 'about',
            title: 'About',
            icon: Info,
            description: 'Learn about brainwaves & sound healing',
            color: 'from-purple-900 to-blue-900'
        },
        {
            id: 'disclaimer',
            title: 'Disclaimer',
            icon: FileText,
            description: 'Important safety information',
            color: 'from-slate-900 to-gray-900'
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
                            className={`nav - card glass - card bg - gradient - to - br ${item.color} `}
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
