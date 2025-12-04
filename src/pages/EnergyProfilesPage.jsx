import { useState } from 'react';
import { ArrowLeft, Clock, Zap, Diamond, Flame, Heart, Feather, Shield, Palette, Waves, Rocket } from 'lucide-react';
import { energyProfiles } from '../data/energyProfiles';
import './EnergyProfilesPage.css';

const iconMap = {
    Diamond, Zap, Flame, Heart, Feather, Shield, Palette, Waves, Rocket
};

export function EnergyProfilesPage({ onBack, onPlay, currentTrack, isPlaying }) {
    const [selectedDuration, setSelectedDuration] = useState('short'); // 'short' or 'long'

    const handlePlay = (profile) => {
        const config = selectedDuration === 'short' ? profile.short : profile.long;

        onPlay({
            id: `energy-${profile.id}-${selectedDuration}`,
            title: `${profile.title} (${selectedDuration === 'short' ? '3 min' : '30 min'})`,
            ...config.frequencies,
            noiseType: config.noiseType,
            type: config.soundscapeType,
            desc: profile.description
        });
    };

    return (
        <div className="energy-profiles-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <div className="best-results-banner">
                ✨ Daily tuning ritual: Set your intention and let the frequencies align your energy. 🎧
            </div>

            <h1 className="page-title">Energy Profiles</h1>
            <p className="page-subtitle">Today I need...</p>

            {/* Duration Selector */}
            <div className="duration-selector">
                <button
                    className={`duration-btn ${selectedDuration === 'short' ? 'active' : ''}`}
                    onClick={() => setSelectedDuration('short')}
                >
                    <Clock size={16} />
                    <span>Quick (3 min)</span>
                </button>
                <button
                    className={`duration-btn ${selectedDuration === 'long' ? 'active' : ''}`}
                    onClick={() => setSelectedDuration('long')}
                >
                    <Zap size={16} />
                    <span>Deep (30 min)</span>
                </button>
            </div>

            {/* Profiles Grid */}
            <div className="profiles-grid">
                {energyProfiles.map(profile => {
                    const isActive = currentTrack?.id === `energy-${profile.id}-${selectedDuration}`;
                    const Icon = iconMap[profile.icon];

                    return (
                        <button
                            key={profile.id}
                            className={`profile-card ${isActive ? 'active' : ''}`}
                            onClick={() => handlePlay(profile)}
                        >
                            <div className={`profile-icon-wrapper bg-gradient-to-br ${profile.color}`}>
                                {Icon && <Icon size={32} color="white" />}
                            </div>
                            <h3 className="profile-title">{profile.title}</h3>
                            <p className="profile-desc">{profile.description}</p>

                            {isActive && isPlaying && (
                                <div className="playing-indicator">
                                    <div className="pulse-ring"></div>
                                    <span>Playing</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <footer className="page-footer">
                © NeoTheory Music LLC & Mixie 2025
            </footer>
        </div>
    );
}
