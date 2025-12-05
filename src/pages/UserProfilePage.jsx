import { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, Target, Music, Save } from 'lucide-react';
import * as Icons from 'lucide-react';
import './UserProfilePage.css';

const AVAILABLE_ICONS = [
    'Heart', 'Star', 'Moon', 'Sun', 'Sparkles', 'Zap', 'Wind', 'Flame',
    'Droplet', 'Leaf', 'Flower', 'Mountain', 'Waves', 'Cloud', 'Rainbow',
    'Music', 'Headphones', 'Radio', 'Disc', 'Activity', 'Target', 'Award'
];

export function UserProfilePage({ onBack }) {
    const [profile, setProfile] = useState({
        username: '',
        avatar: 'Heart',
        goals: '',
        sharedSounds: []
    });
    const [customSounds, setCustomSounds] = useState([]);

    useEffect(() => {
        // Load profile from localStorage
        const savedProfile = localStorage.getItem('omnisync_profile');
        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error('Failed to load profile:', e);
            }
        }

        // Load username from INNERSYNC if exists
        const savedUsername = localStorage.getItem('omnisync_username');
        if (savedUsername && !profile.username) {
            setProfile(prev => ({ ...prev, username: savedUsername }));
        }

        // Load custom sounds
        const savedSounds = localStorage.getItem('omnisync_custom_sounds');
        if (savedSounds) {
            try {
                setCustomSounds(JSON.parse(savedSounds));
            } catch (e) {
                console.error('Failed to load custom sounds:', e);
            }
        }
    }, []);

    const saveProfile = () => {
        localStorage.setItem('omnisync_profile', JSON.stringify(profile));
        // Also save username to INNERSYNC storage
        localStorage.setItem('omnisync_username', profile.username);
        alert('Profile saved! ✨');
    };

    const toggleSharedSound = (sound) => {
        setProfile(prev => {
            const isShared = prev.sharedSounds.some(s => s.id === sound.id);
            let newShared;

            if (isShared) {
                newShared = prev.sharedSounds.filter(s => s.id !== sound.id);
            } else if (prev.sharedSounds.length < 3) {
                newShared = [...prev.sharedSounds, sound];
            } else {
                alert('You can only share up to 3 custom sounds');
                return prev;
            }

            return { ...prev, sharedSounds: newShared };
        });
    };

    const AvatarIcon = Icons[profile.avatar] || Icons.Heart;

    return (
        <div className="user-profile-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            <div className="profile-container">
                <h1 className="profile-title">Your Profile</h1>
                <p className="profile-subtitle">Customize your sonic identity</p>

                {/* Avatar Selection */}
                <div className="profile-section">
                    <label className="section-label">
                        <User size={18} />
                        Avatar Icon
                    </label>
                    <div className="avatar-preview">
                        <AvatarIcon size={64} />
                    </div>
                    <div className="icon-grid">
                        {AVAILABLE_ICONS.map(iconName => {
                            const IconComponent = Icons[iconName];
                            return (
                                <button
                                    key={iconName}
                                    className={`icon-option ${profile.avatar === iconName ? 'selected' : ''}`}
                                    onClick={() => setProfile(prev => ({ ...prev, avatar: iconName }))}
                                >
                                    <IconComponent size={24} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Username */}
                <div className="profile-section">
                    <label className="section-label">
                        <User size={18} />
                        Username
                    </label>
                    <input
                        type="text"
                        className="profile-input"
                        placeholder="Enter your username..."
                        value={profile.username}
                        onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                        maxLength={20}
                    />
                </div>

                {/* Goals */}
                <div className="profile-section">
                    <label className="section-label">
                        <Target size={18} />
                        Your Healing Goals
                    </label>
                    <textarea
                        className="profile-textarea"
                        placeholder="What do you hope to achieve with sound healing? (e.g., better sleep, reduced anxiety, enhanced focus...)"
                        value={profile.goals}
                        onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                        rows={4}
                        maxLength={300}
                    />
                </div>

                {/* Shared Custom Sounds */}
                <div className="profile-section">
                    <label className="section-label">
                        <Music size={18} />
                        Share Your Custom Sounds ({profile.sharedSounds.length}/3)
                    </label>
                    <p className="section-hint">Select up to 3 custom sounds to share on your profile</p>

                    {customSounds.length === 0 ? (
                        <div className="empty-sounds">
                            <Music size={32} />
                            <p>No custom sounds yet</p>
                            <p className="empty-subtitle">Create sounds in the Custom Generator to share them here</p>
                        </div>
                    ) : (
                        <div className="sounds-list">
                            {customSounds.map((sound, index) => (
                                <div key={index} className="sound-item">
                                    <div className="sound-info">
                                        <div className="sound-name">{sound.title || `Custom Sound ${index + 1}`}</div>
                                        <div className="sound-details">{sound.left}Hz / {sound.right}Hz • {sound.beat}Hz beat</div>
                                    </div>
                                    <button
                                        className={`share-toggle ${profile.sharedSounds.some(s => s.id === sound.id) ? 'active' : ''}`}
                                        onClick={() => toggleSharedSound(sound)}
                                    >
                                        <Heart size={18} fill={profile.sharedSounds.some(s => s.id === sound.id) ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button className="save-profile-btn" onClick={saveProfile}>
                    <Save size={20} />
                    Save Profile
                </button>
            </div>
        </div>
    );
}
