import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Bell, Shield, Smartphone, ToggleLeft, ToggleRight, Info, Database, Download, Upload } from 'lucide-react';
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
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Dream Journal Quick Access</span>
                            <span className="setting-desc">Show quick access button on home page for dream journaling</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('dreamJournalQuickAccess')}
                        >
                            {settings.dreamJournalQuickAccess ?
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
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">PIN Lock for InnerSync</span>
                            <span className="setting-desc">Require PIN to access your personal healing hub</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('innerSyncPinLock')}
                        >
                            {settings.innerSyncPinLock ?
                                <ToggleRight size={40} className="toggle-on" /> :
                                <ToggleLeft size={40} className="toggle-off" />
                            }
                        </button>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">PIN Lock for Manifestation Portal</span>
                            <span className="setting-desc">Require PIN to access manifestation portal</span>
                        </div>
                        <button
                            className="toggle-btn"
                            onClick={() => toggleSetting('manifestationPinLock')}
                        >
                            {settings.manifestationPinLock ?
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

                {/* Data Management */}
                <div className="settings-section">
                    <div className="section-header">
                        <Database size={24} className="section-icon" />
                        <h3>Data Management</h3>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Backup Data</span>
                            <span className="setting-desc">Export your journal and settings to a file</span>
                        </div>
                        <button
                            className="action-btn"
                            onClick={() => {
                                const data = {};
                                for (let i = 0; i < localStorage.length; i++) {
                                    const key = localStorage.key(i);
                                    if (key.startsWith('omnisync_')) {
                                        data[key] = JSON.parse(localStorage.getItem(key));
                                    }
                                }
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `omnisync-backup-${new Date().toISOString().split('T')[0]}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                        >
                            <Download size={20} />
                            Export
                        </button>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <span className="setting-label">Restore Data</span>
                            <span className="setting-desc">Import data from a backup file</span>
                        </div>
                        <label className="action-btn">
                            <Upload size={20} />
                            Import
                            <input
                                type="file"
                                accept=".json"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        try {
                                            const data = JSON.parse(event.target.result);
                                            Object.keys(data).forEach(key => {
                                                if (key.startsWith('omnisync_')) {
                                                    localStorage.setItem(key, JSON.stringify(data[key]));
                                                }
                                            });
                                            alert('Data restored successfully! The app will reload.');
                                            window.location.reload();
                                        } catch (err) {
                                            alert('Failed to restore data: Invalid file format.');
                                        }
                                    };
                                    reader.readAsText(file);
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div >
    );
}
