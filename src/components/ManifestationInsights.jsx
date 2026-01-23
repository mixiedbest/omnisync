import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Flame, Download, BarChart3, PieChart, Hash } from 'lucide-react';
import './ManifestationInsights.css';

export function ManifestationInsights({ manifestations = [], onClose }) {
    const [activeView, setActiveView] = useState('overview'); // overview, calendar, analytics

    // Calculate insights
    const totalSessions = manifestations.reduce((sum, m) => sum + (m.waterCount || 1), 0);
    const uniqueIntentions = manifestations.length;

    // Calculate streak
    const calculateStreak = () => {
        if (manifestations.length === 0) return 0;

        const dates = manifestations
            .map(m => new Date(m.lastWatered || m.date).toDateString())
            .sort((a, b) => new Date(b) - new Date(a));

        const uniqueDates = [...new Set(dates)];
        let streak = 0;
        const today = new Date().toDateString();

        for (let i = 0; i < uniqueDates.length; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            if (uniqueDates.includes(checkDate.toDateString())) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const streak = calculateStreak();

    // Archetype frequency
    const archetypeStats = manifestations.reduce((acc, m) => {
        const archetype = m.archetype || 'unknown';
        acc[archetype] = (acc[archetype] || 0) + (m.waterCount || 1);
        return acc;
    }, {});

    const archetypeNames = {
        grounded: 'Grounded & Safe',
        love: 'Open Heart / Love',
        creative: 'Creative Flow',
        clarity: 'Clarity & Direction',
        abundance: 'Abundance / Expansion'
    };

    const archetypeColors = {
        grounded: '#8B4513',
        love: '#16a34a',
        creative: '#2563eb',
        clarity: '#4f46e5',
        abundance: '#eab308'
    };

    // Word frequency from intentions
    const getWordFrequency = () => {
        const words = manifestations
            .map(m => m.intention.toLowerCase())
            .join(' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !['that', 'with', 'this', 'from', 'have', 'will'].includes(word));

        const frequency = words.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    };

    const wordFrequency = getWordFrequency();

    // Export data
    const exportData = () => {
        const data = {
            exportDate: new Date().toISOString(),
            totalSessions,
            uniqueIntentions,
            currentStreak: streak,
            manifestations: manifestations.map(m => ({
                intention: m.intention,
                archetype: m.archetype,
                dateCreated: m.date,
                lastPracticed: m.lastWatered,
                practiceCount: m.waterCount || 1
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manifestation-journal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="insights-modal">
            <div className="insights-container">
                <div className="insights-header">
                    <h2>Manifestation Insights</h2>
                    <button className="close-insights" onClick={onClose}>×</button>
                </div>

                <div className="insights-tabs">
                    <button
                        className={activeView === 'overview' ? 'active' : ''}
                        onClick={() => setActiveView('overview')}
                    >
                        <BarChart3 size={16} />
                        Overview
                    </button>
                    <button
                        className={activeView === 'calendar' ? 'active' : ''}
                        onClick={() => setActiveView('calendar')}
                    >
                        <Calendar size={16} />
                        Calendar
                    </button>
                    <button
                        className={activeView === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveView('analytics')}
                    >
                        <PieChart size={16} />
                        Analytics
                    </button>
                </div>

                <div className="insights-content">
                    {activeView === 'overview' && (
                        <div className="overview-view">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.2)' }}>
                                        <Target size={24} style={{ color: '#eab308' }} />
                                    </div>
                                    <div className="stat-info">
                                        <div className="stat-value">{totalSessions}</div>
                                        <div className="stat-label">Total Sessions</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                                        <TrendingUp size={24} style={{ color: '#8b5cf6' }} />
                                    </div>
                                    <div className="stat-info">
                                        <div className="stat-value">{uniqueIntentions}</div>
                                        <div className="stat-label">Unique Intentions</div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                                        <Flame size={24} style={{ color: '#ef4444' }} />
                                    </div>
                                    <div className="stat-info">
                                        <div className="stat-value">{streak}</div>
                                        <div className="stat-label">Day Streak</div>
                                    </div>
                                </div>
                            </div>

                            <div className="section">
                                <h3>Archetype Distribution</h3>
                                <div className="archetype-bars">
                                    {Object.entries(archetypeStats).map(([archetype, count]) => {
                                        const percentage = (count / totalSessions) * 100;
                                        return (
                                            <div key={archetype} className="archetype-bar">
                                                <div className="bar-label">
                                                    <span>{archetypeNames[archetype] || archetype}</span>
                                                    <span>{count} sessions</span>
                                                </div>
                                                <div className="bar-track">
                                                    <div
                                                        className="bar-fill"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            background: archetypeColors[archetype]
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="section">
                                <h3>Top Intention Themes</h3>
                                <div className="word-cloud">
                                    {wordFrequency.map(([word, count]) => (
                                        <div
                                            key={word}
                                            className="word-tag"
                                            style={{
                                                fontSize: `${12 + count * 2}px`,
                                                opacity: 0.6 + (count / wordFrequency[0][1]) * 0.4
                                            }}
                                        >
                                            {word} <span className="word-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="export-btn" onClick={exportData}>
                                <Download size={16} />
                                Export Journal
                            </button>
                        </div>
                    )}

                    {activeView === 'calendar' && (
                        <div className="calendar-view">
                            <h3>Practice Calendar</h3>
                            <div className="manifestation-list">
                                {manifestations.map(m => (
                                    <div key={m.id} className="manifestation-item">
                                        <div className="item-date">
                                            {new Date(m.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="item-content">
                                            <div className="item-intention">{m.intention}</div>
                                            <div className="item-meta">
                                                <span className="item-archetype" style={{ color: archetypeColors[m.archetype] }}>
                                                    {archetypeNames[m.archetype]}
                                                </span>
                                                {m.waterCount > 1 && (
                                                    <span className="item-water">💧 {m.waterCount}x</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeView === 'analytics' && (
                        <div className="analytics-view">
                            <div className="section">
                                <h3>Practice Patterns</h3>
                                <div className="pattern-insights">
                                    <div className="insight-card">
                                        <Hash size={20} />
                                        <div>
                                            <div className="insight-value">
                                                {Object.keys(archetypeStats).length}
                                            </div>
                                            <div className="insight-label">Archetypes Explored</div>
                                        </div>
                                    </div>
                                    <div className="insight-card">
                                        <TrendingUp size={20} />
                                        <div>
                                            <div className="insight-value">
                                                {manifestations.filter(m => m.waterCount > 1).length}
                                            </div>
                                            <div className="insight-label">Reinforced Intentions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section">
                                <h3>Most Practiced Intention</h3>
                                {manifestations.length > 0 && (() => {
                                    const topManifestation = [...manifestations].sort((a, b) => (b.waterCount || 1) - (a.waterCount || 1))[0];
                                    return (
                                        <div className="top-intention">
                                            <div className="top-intention-text">
                                                "{topManifestation.intention}"
                                            </div>
                                            <div className="top-intention-count">
                                                Practiced {topManifestation.waterCount || 1} times
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
