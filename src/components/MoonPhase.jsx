import { useState } from 'react';
import { X, Sparkles, Moon, ArrowRight } from 'lucide-react';
import './MoonPhase.css';

export function MoonPhase({ onLaunchPortal }) {
    const [showPreview, setShowPreview] = useState(false);

    // Calculate current moon phase
    const getMoonPhase = (date = new Date()) => {
        const lunarMonth = 29.53058867;
        const knownNewMoon = new Date('2000-01-06');
        const diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
        const phase = (diff % lunarMonth) / lunarMonth;
        
        if (phase < 0.0625) return { name: 'new', emoji: '🌑' };
        if (phase < 0.1875) return { name: 'waxing-crescent', emoji: '🌒' };
        if (phase < 0.3125) return { name: 'first-quarter', emoji: '🌓' };
        if (phase < 0.4375) return { name: 'waxing-gibbous', emoji: '🌔' };
        if (phase < 0.5625) return { name: 'full', emoji: '🌕' };
        if (phase < 0.6875) return { name: 'waning-gibbous', emoji: '🌖' };
        if (phase < 0.8125) return { name: 'last-quarter', emoji: '🌗' };
        return { name: 'waning-crescent', emoji: '🌘' };
    };

    const currentPhase = getMoonPhase();

    const phasePortals = {
        'new': {
            title: 'New Moon Portal',
            subtitle: 'Plant Seeds of Intention',
            description: 'The moon is dark. This is the most powerful time for setting new intentions.',
            recommendedArchetype: 'clarity',
            intentionPrompt: 'What new beginning are you calling in?',
            practices: ['Set clear intentions', 'Visualize as if already true', 'Feel the emotion']
        },
        'waxing-crescent': {
            title: 'Waxing Crescent Portal',
            subtitle: 'Take Inspired Action',
            description: 'The moon grows. Channel creative energy into manifesting your desires.',
            recommendedArchetype: 'creative',
            intentionPrompt: 'What action will you take toward your dreams?',
            practices: ['Focus on momentum', 'Channel creative flow', 'Trust the process']
        },
        'first-quarter': {
            title: 'First Quarter Portal',
            subtitle: 'Overcome & Persist',
            description: 'Half moon rising. Build strength to overcome any obstacles.',
            recommendedArchetype: 'grounded',
            intentionPrompt: 'What challenge are you ready to overcome?',
            practices: ['Face obstacles with courage', 'Ground into your power', 'Stay committed']
        },
        'waxing-gibbous': {
            title: 'Waxing Gibbous Portal',
            subtitle: 'Refine & Trust',
            description: 'Almost full. Fine-tune your intentions and trust divine timing.',
            recommendedArchetype: 'abundance',
            intentionPrompt: 'What are you preparing to receive?',
            practices: ['Refine your vision', 'Practice patience', 'Prepare to receive']
        },
        'full': {
            title: 'Full Moon Portal',
            subtitle: 'Celebrate & Release',
            description: 'Fully illuminated. Celebrate manifestations and release what no longer serves.',
            recommendedArchetype: 'love',
            intentionPrompt: 'What are you grateful for? What are you releasing?',
            practices: ['Express gratitude', 'Release limiting beliefs', 'Celebrate your journey']
        },
        'waning-gibbous': {
            title: 'Waning Gibbous Portal',
            subtitle: 'Share & Reflect',
            description: 'Moon wanes. Reflect on lessons and share your abundance.',
            recommendedArchetype: 'love',
            intentionPrompt: 'What wisdom have you gained?',
            practices: ['Journal insights', 'Share your gifts', 'Express gratitude']
        },
        'last-quarter': {
            title: 'Last Quarter Portal',
            subtitle: 'Release & Forgive',
            description: 'Half moon setting. Let go and make space for new growth.',
            recommendedArchetype: 'grounded',
            intentionPrompt: 'What are you ready to release?',
            practices: ['Release old patterns', 'Forgive', 'Clear space']
        },
        'waning-crescent': {
            title: 'Waning Crescent Portal',
            subtitle: 'Rest & Restore',
            description: 'Thin crescent. Rest deeply and prepare for the new cycle.',
            recommendedArchetype: 'grounded',
            intentionPrompt: 'What do you need to restore your energy?',
            practices: ['Deep rest', 'Inner reflection', 'Prepare for new beginnings']
        }
    };

    const portal = phasePortals[currentPhase.name];

    const launchMoonPortal = () => {
        if (onLaunchPortal) {
            onLaunchPortal({
                phase: currentPhase.name,
                archetype: portal.recommendedArchetype,
                intentionPrompt: portal.intentionPrompt
            });
        }
        setShowPreview(false);
    };

    return (
        <div className="moon-phase-container">
            <div 
                className={`moon-display ${currentPhase.name}`}
                onClick={() => setShowPreview(true)}
            >
                <div className="moon-glow"></div>
                <div className="moon-emoji">{currentPhase.emoji}</div>
                <div className="moon-label">Moon Portal</div>
            </div>

            {showPreview && (
                <div className="moon-portal-preview">
                    <div className="moon-portal-content">
                        <button className="close-moon-portal" onClick={() => setShowPreview(false)}>
                            <X size={24} />
                        </button>

                        <div className="portal-preview-header">
                            <div className="moon-icon-large">{currentPhase.emoji}</div>
                            <h2>{portal.title}</h2>
                            <p className="portal-subtitle">{portal.subtitle}</p>
                            <p className="portal-description">{portal.description}</p>
                        </div>

                        <div className="portal-practices">
                            <h3>This Portal Includes:</h3>
                            <ul>
                                {portal.practices.map((practice, i) => (
                                    <li key={i}>{practice}</li>
                                ))}
                            </ul>
                        </div>

                        <button className="launch-portal-btn" onClick={launchMoonPortal}>
                            <span>Enter {portal.title}</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
