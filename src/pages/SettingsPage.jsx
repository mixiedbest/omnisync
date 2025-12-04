import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Bell, Shield, Smartphone, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import './SettingsPage.css';

export function SettingsPage({ onBack }) {
    const [settings, setSettings] = useState({
        journalPrompts: true,
        showMutuals: true,
        backgroundPlay: true
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('omnisync_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const toggleSetting = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        localStorage.setItem('omnisync_settings', JSON.stringify(newSettings));
    };

    return (
        <div className="settings-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="settings-header">
                <h1 className="page-title">
                    <Settings size={32} />
                    Settings
                </h1>
                <p className="page-subtitle">Customize Your Experience</p>
            </div>

            <div className="settings-container">
                {/* Journaling Preferences */}
                <div className="settings-section">
                    <div className="section-header">
                        <Bell size={24} className="section-icon" />
                        <h3>Journaling Preferences</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Session Prompts</span>
                            <span className="setting-desc">Prompt to log mood before & after sessions</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('journalPrompts')}
                        >
                            {settings.journalPrompts ?
                                <ToggleRight size={40} className="toggle-on" /> :
                                <ToggleLeft size={40} className="toggle-off" />
                            }
                        </button>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="settings-section">
                    <div className="section-header">
                        <Shield size={24} className="section-icon" />
                        <h3>Privacy & Connections</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Show Mutual Connections</span>
                            <span className="setting-desc">Allow others to see mutual friends</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('showMutuals')}
                        >
                            {settings.showMutuals ?
                                <ToggleRight size={40} className="toggle-on" /> :
                                <ToggleLeft size={40} className="toggle-off" />
                            }
                        </button>
                    </div>
                </div>

                {/* App Behavior */}
                <div className="settings-section">
                    <div className="section-header">
                        <Smartphone size={24} className="section-icon" />
                        <h3>App Behavior</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Background Playback</span>
                            <span className="setting-desc">Continue playing when screen is locked</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('backgroundPlay')}
                        >
                            {settings.backgroundPlay ?
                                <ToggleRight size={40} className="toggle-on" /> :
                                <ToggleLeft size={40} className="toggle-off" />
                            }
                        </button>
                    </div>
                    <div className="info-box">
                        <Info size={16} />
                        <p>Note: Background playback support varies by device and browser restrictions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
