import { useState } from 'react';
import { ArrowLeft, Play, Clock, Zap } from 'lucide-react';
import { journeys } from '../data/journeys';
import './JourneysPage.css';

export function JourneysPage({ onBack, onSelectJourney }) {
    const [selectedDuration, setSelectedDuration] = useState('short');

    const handleSelectJourney = (journey) => {
        const config = selectedDuration === 'short' ? journey.short : journey.long;
        let phases = [...config.phases];



        onSelectJourney({
            ...journey,
            selectedDuration,
            phases,
            totalDuration: config.duration
        });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    return (
        <div className="journeys-page">
            <div className="page-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>

            <div className="best-results-banner">
                ✨ Multi-phase sound healing experiences. Each journey is a ritual. 🎧
            </div>

            <h1 className="page-title">Curated Journeys</h1>
            <p className="page-subtitle">Immersive, transformational sound experiences</p>

            {/* Duration Selector */}
            <div className="duration-selector">
                <button
                    className={`duration-btn ${selectedDuration === 'short' ? 'active' : ''}`}
                    onClick={() => setSelectedDuration('short')}
                >
                    <Clock size={16} />
                    <span>Short</span>
                </button>
                <button
                    className={`duration-btn ${selectedDuration === 'long' ? 'active' : ''}`}
                    onClick={() => setSelectedDuration('long')}
                >
                    <Zap size={16} />
                    <span>Long</span>
                </button>
            </div>

            {/* Journeys Grid */}
            <div className="journeys-grid">
                {journeys.map(journey => {
                    const config = selectedDuration === 'short' ? journey.short : journey.long;

                    return (
                        <div key={journey.id} className="journey-card">
                            <div className="journey-emoji">{journey.emoji}</div>
                            <h3 className="journey-title">{journey.title}</h3>
                            <p className="journey-desc">{journey.description}</p>

                            <div className="journey-meta">
                                <span className="journey-duration">{formatDuration(config.duration)}</span>
                                <span className="journey-phases">{config.phases.length} phases</span>
                            </div>



                            <button
                                className="journey-play-btn"
                                onClick={() => handleSelectJourney(journey)}
                            >
                                <Play size={20} />
                                <span>Begin Journey</span>
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
