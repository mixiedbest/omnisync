import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Anchor, Heart, Waves, TrendingUp, Zap, TreePine, Info } from 'lucide-react';
import { useBinauralBeat } from '../hooks/useBinauralBeat';
import { PinLock } from '../components/PinLock';
import { ManifestationGarden, SeedPlantingCeremony } from '../components/ManifestationGarden';
import { BreathSync } from '../components/BreathSync';
import { ManifestationInsights } from '../components/ManifestationInsights';
import './ManifestationPortalPage.css';

export function ManifestationPortalPage({ onNavigate }) {
    const [stage, setStage] = useState('entrance'); // entrance, seed-ceremony, input, preset, portal, completion, garden
    const [intention, setIntention] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [portalActive, setPortalActive] = useState(false);
    const [activeManifestationId, setActiveManifestationId] = useState(null); // Track which manifestation is being nurtured
    const [showNurtureModal, setShowNurtureModal] = useState(false);
    const [nurtureTarget, setNurtureTarget] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPinLock, setShowPinLock] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [manifestations, setManifestations] = useState([]);
    const [seedPlanted, setSeedPlanted] = useState(false);
    const [showGarden, setShowGarden] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Check PIN lock and load manifestations on mount
    useEffect(() => {
        const settings = JSON.parse(localStorage.getItem('omnisync_settings') || '{}');
        if (settings.manifestationPinLock) {
            setShowPinLock(true);
        } else {
            setIsUnlocked(true);
        }

        // Load seed and manifestations
        const seed = localStorage.getItem('omnisync_manifestation_seed');
        const savedManifestations = JSON.parse(localStorage.getItem('omnisync_manifestations') || '[]');
        setSeedPlanted(!!seed);
        setManifestations(savedManifestations);
    }, []);

    const presets = [
        {
            id: 'grounded',
            name: 'Grounded & Safe',
            icon: Anchor,
            frequencies: { left: 194, right: 256, beat: 10 },
            breathPattern: { inhale: 4, hold: 2, exhale: 6 },
            visualStyle: 'heavy',
            color: '#8B4513'
        },
        {
            id: 'love',
            name: 'Open Heart / Love',
            icon: Heart,
            frequencies: { left: 639, right: 1034, beat: 8 },
            breathPattern: { inhale: 5, hold: 2, exhale: 5 },
            visualStyle: 'torus',
            color: '#16a34a'
        },
        {
            id: 'creative',
            name: 'Creative Flow',
            icon: Waves,
            frequencies: { left: 528, right: 741, beat: 6 },
            breathPattern: { inhale: 4, hold: 1, exhale: 4 },
            visualStyle: 'flowing',
            color: '#2563eb'
        },
        {
            id: 'clarity',
            name: 'Clarity & Direction',
            icon: Zap,
            frequencies: { left: 852, right: 1379, beat: 7 },
            breathPattern: { inhale: 4, hold: 3, exhale: 4 },
            visualStyle: 'geometric',
            color: '#4f46e5'
        },
        {
            id: 'abundance',
            name: 'Abundance / Expansion',
            icon: TrendingUp,
            frequencies: { left: 432, right: 699, beat: 5 },
            breathPattern: { inhale: 6, hold: 2, exhale: 6 },
            visualStyle: 'spiral',
            color: '#eab308'
        }
    ];

    const currentPreset = presets.find(p => p.id === selectedPreset);

    // Audio playback - hook doesn't take parameters
    const { play, stop } = useBinauralBeat();

    // Manage audio playback based on stage
    useEffect(() => {
        if (stage === 'portal' && currentPreset) {
            // Play with the preset's frequencies
            play(
                currentPreset.frequencies.left,
                currentPreset.frequencies.right,
                0, // bothEarsFreq
                null, // noiseType
                null, // soundscapeType
                { left: 0.5, right: 0.5 } // volumes
            );
        }

        // Only stop when leaving portal
        return () => {
            if (stage !== 'portal') {
                stop();
            }
        };
    }, [stage, currentPreset]); // Removed play/stop from dependencies to prevent re-triggering

    // Portal animation
    useEffect(() => {
        if (stage !== 'portal' || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;
        const preset = presets.find(p => p.id === selectedPreset);
        if (!preset) return;

        const animate = () => {
            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;

            // Deep space gradient background
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
            gradient.addColorStop(0, '#0a0a1a');
            gradient.addColorStop(0.5, '#050510');
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add subtle grain
            for (let i = 0; i < 100; i++) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
                ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
            }

            // Draw based on visual style
            ctx.save();
            ctx.translate(cx, cy);

            if (preset.visualStyle === 'spiral') {
                drawGoldenSpiral(ctx, time, preset.color);
            } else if (preset.visualStyle === 'torus') {
                drawTorus(ctx, time, preset.color);
            } else if (preset.visualStyle === 'geometric') {
                drawMandala(ctx, time, preset.color);
            } else if (preset.visualStyle === 'flowing') {
                drawFlowingLines(ctx, time, preset.color);
            } else {
                drawHeavyOrbit(ctx, time, preset.color);
            }

            ctx.restore();

            // Draw intention text wrapped around center
            drawIntentionText(ctx, intention, cx, cy, time, preset.color);

            time += 0.01;
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [stage, selectedPreset, intention]);

    const drawGoldenSpiral = (ctx, time, color) => {
        const phi = 1.618033988749;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 + Math.sin(time * 2) * 0.2;

        for (let i = 0; i < 200; i++) {
            const angle = i * 0.1 + time;
            const radius = Math.pow(phi, i * 0.02) * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    };

    const drawTorus = (ctx, time, color) => {
        const R = 150; // Major radius
        const r = 50;  // Minor radius

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;

        for (let u = 0; u < Math.PI * 2; u += 0.2) {
            ctx.beginPath();
            for (let v = 0; v < Math.PI * 2; v += 0.1) {
                const x = (R + r * Math.cos(v + time)) * Math.cos(u);
                const y = (R + r * Math.cos(v + time)) * Math.sin(u);

                if (v === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    };

    const drawMandala = (ctx, time, color) => {
        const petals = 8;
        const radius = 150;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;

        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            ctx.save();
            ctx.rotate(angle + time * 0.5);

            ctx.beginPath();
            ctx.arc(0, radius, 40, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
        }
    };

    const drawFlowingLines = (ctx, time, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            for (let x = -300; x < 300; x += 10) {
                const y = Math.sin(x * 0.01 + time + i) * 50 + Math.sin(x * 0.005 + time * 0.5) * 30;
                if (x === -300) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    };

    const drawHeavyOrbit = (ctx, time, color) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;

        for (let i = 0; i < 3; i++) {
            const angle = time * (0.5 + i * 0.2);
            const radius = 100 + i * 40;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.arc(x, y, 10 - i * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const drawIntentionText = (ctx, text, cx, cy, time, color) => {
        if (!text) return;

        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.6 + Math.sin(time * 2) * 0.2;

        const words = text.split(' ');
        const radius = 200;
        const angleStep = (Math.PI * 2) / words.length;

        words.forEach((word, i) => {
            const angle = i * angleStep + time * 0.3;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(word, 0, 0);
            ctx.restore();
        });
    };

    const enterPortal = () => {
        // Check if seed has been planted
        if (!seedPlanted) {
            setStage('seed-ceremony');
        } else {
            setStage('input');
        }
    };

    const handleSeedPlanted = (seedIntention) => {
        localStorage.setItem('omnisync_manifestation_seed', seedIntention);
        setSeedPlanted(true);
        setStage('input');
    };

    const handleNurture = (manifestation) => {
        console.log('Handling Nurture for:', manifestation);
        setNurtureTarget(manifestation);
        setShowNurtureModal(true);
    };

    const startNurtureSession = () => {
        if (!nurtureTarget) return;

        setActiveManifestationId(nurtureTarget.id);
        setIntention(nurtureTarget.intention);
        setSelectedPreset(nurtureTarget.archetype); // Use stored archetype ID
        setShowNurtureModal(false);
        setShowGarden(false);

        // Skip input/preset selection, go straight to portal
        setStage('portal');
        setPortalActive(true);
        setIsPlaying(true);
    };

    const selectPreset = (presetId) => {
        setSelectedPreset(presetId);
        setTimeout(() => {
            setStage('portal');
            setPortalActive(true);
            setIsPlaying(true);
        }, 500);
    };

    const completeSession = () => {
        setIsPlaying(false);

        // Save manifestation to garden (or water existing one)
        if (intention && selectedPreset) {
            // Check if this intention already exists (case-insensitive)
            const existingIndex = manifestations.findIndex(
                m => m.intention.toLowerCase().trim() === intention.toLowerCase().trim()
            );

            let updated = [...manifestations];
            if (existingIndex !== -1) {
                // Water existing manifestation (Nurture Logic)
                const current = updated[existingIndex];
                const newSessionCount = (current.sessionsCompleted || 0) + 1;

                // Determine stage based on 3x3 protocol
                let newStage = current.stage || 'seed';
                if (newSessionCount >= 9) newStage = 'bloom';
                else if (newSessionCount >= 6) newStage = 'sapling';
                else if (newSessionCount >= 3) newStage = 'sprout';

                updated[existingIndex] = {
                    ...current,
                    waterCount: (current.waterCount || 1) + 1,
                    sessionsCompleted: newSessionCount,
                    lastSessionDate: new Date().toISOString(),
                    lastWatered: new Date().toISOString(),
                    stage: newStage,
                    archetype: selectedPreset // Update archetype if changed
                };
            } else {
                // Create new manifestation
                const newManifestation = {
                    id: Date.now(),
                    intention,
                    archetype: selectedPreset,
                    date: new Date().toISOString(),
                    lastWatered: new Date().toISOString(),
                    lastSessionDate: new Date().toISOString(),
                    waterCount: 1,
                    sessionsCompleted: 1,
                    stage: 'seed',
                    bloomed: false
                };
                updated = [...manifestations, newManifestation];
            }

            setManifestations(updated);
            localStorage.setItem('omnisync_manifestations', JSON.stringify(updated));
            setActiveManifestationId(null); // Reset active tracking
        }

        setStage('completion');
        setTimeout(() => {
            setStage('entrance');
            setIntention('');
            setSelectedPreset(null);
            setPortalActive(false);
        }, 5000);
    };

    const viewGarden = () => {
        setShowGarden(true);
    };

    const closeGarden = () => {
        setShowGarden(false);
    };

    const viewInsights = () => {
        setShowInsights(true);
    };

    const closeInsights = () => {
        setShowInsights(false);
    };

    const handleMoonPortalLaunch = (moonData) => {
        // moonData contains: { phase, archetype, intentionPrompt }
        setShowGarden(false); // Close garden
        setIntention(moonData.intentionPrompt); // Pre-fill intention
        setSelectedPreset(moonData.archetype); // Pre-select archetype
        setStage('preset'); // Go to preset selection (they can see/change archetype)
    };

    // Show PIN lock if enabled and not unlocked
    if (showPinLock && !isUnlocked) {
        return (
            <PinLock
                title="Manifestation Portal"
                onUnlock={() => {
                    setIsUnlocked(true);
                    setShowPinLock(false);
                }}
                onCancel={() => onNavigate('home')}
            />
        );
    }

    return (
        <div className={`manifestation-portal ${stage}`}>
            {/* Garden View Modal */}
            {showGarden && (
                <div className="garden-modal">
                    <button className="close-garden-btn" onClick={closeGarden}>
                        <X size={24} />
                    </button>
                    <ManifestationGarden
                        manifestations={manifestations}
                        onSelectManifestation={handleNurture}
                        onViewInsights={viewInsights}
                        onLaunchMoonPortal={handleMoonPortalLaunch}
                        onNurture={handleNurture}
                    />
                </div>
            )}

            {/* Insights Modal */}
            {showInsights && (
                <ManifestationInsights
                    manifestations={manifestations}
                    onClose={closeInsights}
                />
            )}

            {/* Nurture Modal */}
            {showNurtureModal && nurtureTarget && (
                <div className="nurture-modal-overlay">
                    <div className="nurture-modal glass-card">
                        <button className="close-modal-btn" onClick={() => setShowNurtureModal(false)}>
                            <X size={24} />
                        </button>

                        <div className="nurture-header">
                            <Sparkles size={32} style={{ color: 'var(--accent-teal)' }} />
                            <h3>Nurture Your Seed</h3>
                        </div>

                        <div className="nurture-stats">
                            <p className="intention-preview">"{nurtureTarget.intention}"</p>

                            <div className="protocol-progress">
                                <div className="progress-step">
                                    <span className="label">Current Stage</span>
                                    <span className="value capitalize">{nurtureTarget.stage || 'Seed'}</span>
                                </div>
                                <div className="progress-step">
                                    <span className="label">Sessions Completed</span>
                                    <span className="value">{nurtureTarget.sessionsCompleted || 0} / 9</span>
                                </div>
                            </div>

                            <div className="protocol-guide">
                                <h4>3-Day Protocol Progress</h4>
                                <div className="day-indicators">
                                    <div className={`day-dot ${(nurtureTarget.sessionsCompleted || 0) >= 3 ? 'completed' : 'active'}`}>Day 1</div>
                                    <div className={`day-dot ${(nurtureTarget.sessionsCompleted || 0) >= 6 ? 'completed' : ((nurtureTarget.sessionsCompleted || 0) >= 3 ? 'active' : '')}`}>Day 2</div>
                                    <div className={`day-dot ${(nurtureTarget.sessionsCompleted || 0) >= 9 ? 'completed' : ((nurtureTarget.sessionsCompleted || 0) >= 6 ? 'active' : '')}`}>Day 3</div>
                                </div>
                            </div>
                        </div>

                        <button className="start-nurture-btn" onClick={startNurtureSession}>
                            <Heart size={20} fill="currentColor" />
                            Begin Meditation Session
                        </button>
                    </div>
                </div>
            )}

            {/* Seed Planting Ceremony */}
            {stage === 'seed-ceremony' && (
                <SeedPlantingCeremony onComplete={handleSeedPlanted} />
            )}

            {/* About Modal */}
            {showAbout && (
                <div className="about-modal">
                    <button className="close-about-btn" onClick={() => setShowAbout(false)}>
                        <X size={24} />
                    </button>
                    <div className="about-content">
                        <h2>🌟 About the Manifestation Portal</h2>

                        <div className="about-section">
                            <h3>The Science of Manifestation</h3>
                            <p>
                                Manifestation combines neuroscience, quantum physics, and ancient wisdom.
                                When you set an intention with focused attention, you activate neural pathways
                                and create coherence between your thoughts, emotions, and actions.
                            </p>
                            <p>
                                <strong>Key Principles:</strong>
                            </p>
                            <ul>
                                <li><strong>Neuroplasticity:</strong> Your brain rewires itself based on repeated thoughts and beliefs</li>
                                <li><strong>Reticular Activating System (RAS):</strong> Filters reality to show you what aligns with your focus</li>
                                <li><strong>Emotional Resonance:</strong> Feelings amplify the signal of your intentions</li>
                                <li><strong>Coherent State:</strong> Breath + sound + intention creates whole-brain synchronization</li>
                            </ul>
                        </div>

                        <div className="about-section">
                            <h3>How the Portal Works</h3>
                            <p>
                                The Manifestation Portal is a multi-sensory experience designed to create
                                the optimal state for intention-setting:
                            </p>
                            <ul>
                                <li><strong>Binaural Frequencies:</strong> Each archetype uses specific frequencies to entrain your brainwaves</li>
                                <li><strong>Breath Synchronization:</strong> Guided breathing creates coherence between heart and brain</li>
                                <li><strong>Visual Anchoring:</strong> Sacred geometry and flowing patterns engage your visual cortex</li>
                                <li><strong>Present-Tense Intention:</strong> "I am" statements activate as if already true</li>
                            </ul>
                        </div>

                        <div className="about-section">
                            <h3><TreePine size={20} style={{ display: 'inline', marginRight: '8px' }} />Your Manifestation Garden</h3>
                            <p>
                                Your garden tracks your 3-Day Amplification Protocol:
                            </p>
                            <ul>
                                <li><strong>The Seed (Day 1):</strong> Planting your intention. 3 sessions to sprout.</li>
                                <li><strong>The Sprout (Day 2):</strong> Saturation phase. 3 more sessions to grow into a sapling.</li>
                                <li><strong>The Sapling (Day 3):</strong> Zero Contradiction. 3 final sessions to reach full bloom.</li>
                                <li><strong>The Bloom:</strong> A fully realized intention, radiating its frequency.</li>
                            </ul>
                        </div>

                        <div className="about-section">
                            <h3>The Five Archetypes</h3>
                            <ul>
                                <li><Anchor size={16} style={{ display: 'inline', marginRight: '6px', color: '#8B4513' }} /><strong>Grounded & Safe:</strong> Root chakra, stability, security (194-256 Hz)</li>
                                <li><Heart size={16} style={{ display: 'inline', marginRight: '6px', color: '#16a34a' }} /><strong>Open Heart / Love:</strong> Heart chakra, compassion, connection (639-1034 Hz)</li>
                                <li><Waves size={16} style={{ display: 'inline', marginRight: '6px', color: '#2563eb' }} /><strong>Creative Flow:</strong> Sacral/throat, expression, creativity (528-741 Hz)</li>
                                <li><Zap size={16} style={{ display: 'inline', marginRight: '6px', color: '#4f46e5' }} /><strong>Clarity & Direction:</strong> Third eye, intuition, vision (852-1379 Hz)</li>
                                <li><TrendingUp size={16} style={{ display: 'inline', marginRight: '6px', color: '#eab308' }} /><strong>Abundance / Expansion:</strong> Crown, prosperity, limitlessness (432-699 Hz)</li>
                            </ul>
                        </div>

                        <div className="about-section">
                            <h3>Best Practices</h3>
                            <ul>
                                <li>Use headphones for full binaural effect</li>
                                <li>Find a quiet, comfortable space</li>
                                <li>Write intentions in present tense ("I am" not "I will")</li>
                                <li>Feel the emotion of your intention as already true</li>
                                <li>Practice regularly - consistency creates neural pathways</li>
                                <li>Revisit your garden to reinforce intentions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Entrance Stage */}
            {
                stage === 'entrance' && (
                    <div className="portal-entrance fade-in">
                        <div className="spiral-aperture">
                            <Sparkles size={80} className="portal-icon" />
                        </div>
                        <h1>Manifestation Portal</h1>
                        <p className="portal-subtitle">Intention → Resonance → Embodiment</p>
                        <button className="enter-portal-btn" onClick={enterPortal}>
                            Enter the Portal
                        </button>
                        {seedPlanted && manifestations.length > 0 && (
                            <button className="view-garden-btn" onClick={viewGarden}>
                                <TreePine size={20} />
                                View Your Garden ({manifestations.length})
                            </button>
                        )}
                        <button className="info-btn" onClick={() => setShowAbout(true)}>
                            <Info size={20} />
                            How It Works
                        </button>
                    </div>
                )
            }

            {/* Intention Input Stage */}
            {
                stage === 'input' && (
                    <div className="intention-input-stage fade-in">
                        <div className="input-container">
                            <p className="input-prompt">Speak in the present moment...</p>
                            <textarea
                                className="intention-textarea"
                                placeholder="I am..."
                                value={intention}
                                onChange={(e) => setIntention(e.target.value)}
                                autoFocus
                            />
                            <button
                                className="continue-btn"
                                onClick={() => setStage('preset')}
                                disabled={!intention.trim()}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Preset Selection Stage */}
            {
                stage === 'preset' && (
                    <div className="preset-selection fade-in">
                        <h2>Choose Your Resonance</h2>
                        <div className="preset-glyphs">
                            {presets.map(preset => (
                                <button
                                    key={preset.id}
                                    className="preset-glyph"
                                    onClick={() => selectPreset(preset.id)}
                                    style={{ '--preset-color': preset.color }}
                                >
                                    <preset.icon size={48} className="glyph" />
                                    <span className="preset-name">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Portal Active Stage */}
            {
                stage === 'portal' && (
                    <div className="portal-active">
                        <canvas ref={canvasRef} className="portal-canvas" />

                        {/* Breath Synchronization Overlay */}
                        {currentPreset && (
                            <BreathSync
                                breathPattern={currentPreset.breathPattern}
                                onBreathCycle={(count) => {
                                    // Optional: Do something on breath cycles
                                    if (count % 5 === 0) {
                                        console.log(`${count} breath cycles completed`);
                                    }
                                }}
                            />
                        )}

                        <button className="complete-btn" onClick={completeSession}>
                            Complete
                        </button>
                    </div>
                )
            }

            {/* Completion Stage */}
            {
                stage === 'completion' && (
                    <div className="completion-stage fade-in">
                        <div className="completion-message">
                            <Sparkles size={60} className="completion-icon" />
                            <h2>Intention received.</h2>
                            <p>Carry it with you.</p>
                        </div>
                    </div>
                )
            }

            {/* Close button */}
            <button className="close-portal" onClick={() => {
                stop();
                onNavigate('home');
            }}>
                <X size={24} />
            </button>
        </div >
    );
}
