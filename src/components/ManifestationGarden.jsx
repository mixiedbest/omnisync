import { useState, useEffect } from 'react';
import { Sparkles, Heart, Droplets, Sun, BarChart3 } from 'lucide-react';
import { MoonPhase } from './MoonPhase';
import './ManifestationGarden.css';

export function ManifestationGarden({ manifestations = [], onSelectManifestation, onViewInsights, onLaunchMoonPortal }) {
    const [treeStage, setTreeStage] = useState('seed'); // seed, sprout, sapling, tree, blooming
    const [hoveredManifestation, setHoveredManifestation] = useState(null);

    useEffect(() => {
        // Determine tree growth stage based on manifestation count
        const count = manifestations.length;
        if (count === 0) setTreeStage('seed');
        else if (count <= 3) setTreeStage('sprout');
        else if (count <= 7) setTreeStage('sapling');
        else if (count <= 15) setTreeStage('tree');
        else setTreeStage('blooming');
    }, [manifestations.length]);

    const getFlowerColor = (archetype) => {
        const colors = {
            grounded: '#8B4513',
            love: '#16a34a',
            creative: '#2563eb',
            clarity: '#4f46e5',
            abundance: '#eab308'
        };
        return colors[archetype] || '#8B4513';
    };

    const getFlowerPosition = (index, total) => {
        // If there's only one manifestation, center it at the tree
        if (total === 1) {
            return { x: 0, y: 0 };
        }

        // Distribute flowers around the tree in a natural pattern
        // Use pixel-based positioning from center instead of percentages
        const angle = (index / total) * Math.PI * 2;
        const baseRadius = 120; // pixels from center
        const radiusVariation = (index % 3) * 40;
        const radius = baseRadius + radiusVariation;

        // Position relative to center (50%, 50%)
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { x, y };
    };

    return (
        <div className="manifestation-garden">
            {/* Moon Phase */}
            <MoonPhase onLaunchPortal={onLaunchMoonPortal} />
            <div className="garden-canvas">
                {/* Ground */}
                <div className="ground">
                    <div className="soil"></div>
                </div>

                {/* Tree - grows based on stage */}
                <div className={`tree - container stage - ${treeStage} `}>
                    {treeStage === 'seed' && (
                        <div className="seed-visual">
                            <div className="seed-glow"></div>
                            <div className="seed"></div>
                        </div>
                    )}

                    {treeStage === 'sprout' && (
                        <div className="sprout-visual">
                            <div className="sprout-stem"></div>
                            <div className="sprout-leaves">
                                <div className="leaf left"></div>
                                <div className="leaf right"></div>
                            </div>
                        </div>
                    )}

                    {(treeStage === 'sapling' || treeStage === 'tree' || treeStage === 'blooming') && (
                        <div className="tree-visual">
                            {/* Trunk */}
                            <div className="trunk">
                                <div className="bark-texture"></div>
                            </div>

                            {/* Roots */}
                            <div className="roots">
                                <div className="root root-1"></div>
                                <div className="root root-2"></div>
                                <div className="root root-3"></div>
                            </div>

                            {/* Branches */}
                            <div className="branches">
                                <div className="branch branch-1"></div>
                                <div className="branch branch-2"></div>
                                <div className="branch branch-3"></div>
                                {treeStage !== 'sapling' && (
                                    <>
                                        <div className="branch branch-4"></div>
                                        <div className="branch branch-5"></div>
                                    </>
                                )}
                            </div>

                            {/* Canopy */}
                            <div className="canopy">
                                <div className="foliage foliage-1"></div>
                                <div className="foliage foliage-2"></div>
                                <div className="foliage foliage-3"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Manifestations as flowers/orbs */}
                {manifestations.map((manifestation, index) => {
                    const pos = getFlowerPosition(index, manifestations.length);
                    const color = getFlowerColor(manifestation.archetype);
                    const stage = manifestation.stage || 'seed';
                    const sessions = manifestation.sessionsCompleted || 0;

                    // Scale based on growth
                    let scale = 1;
                    if (stage === 'sprout') scale = 1.2;
                    else if (stage === 'sapling') scale = 1.5;
                    else if (stage === 'bloom') scale = 1.8;

                    return (
                        <div
                            key={manifestation.id}
                            className={`manifestation-node stage-${stage}`}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                                '--node-color': color,
                                cursor: 'pointer',
                                zIndex: 5
                            }}
                            onMouseEnter={() => setHoveredManifestation(manifestation)}
                            onMouseLeave={() => setHoveredManifestation(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Clicked manifestation:', manifestation);
                                onSelectManifestation(manifestation);
                            }}
                        >
                            {/* Visual based on stage */}
                            {stage === 'seed' && <div className="node-seed"></div>}

                            {stage === 'sprout' && (
                                <div className="node-sprout">
                                    <div className="leaf left"></div>
                                    <div className="leaf right"></div>
                                </div>
                            )}

                            {stage === 'sapling' && (
                                <div className="node-sapling">
                                    <div className="trunk-mini"></div>
                                    <div className="foliage-mini"></div>
                                </div>
                            )}

                            {(stage === 'tree' || stage === 'bloom') && (
                                <div className="node-bloom">
                                    <div className="flower-glow"></div>
                                    <div className="flower-petals">
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="petal" style={{ transform: `rotate(${i * 60}deg)` }}></div>
                                        ))}
                                    </div>
                                    <div className="flower-center"></div>
                                </div>
                            )}

                            {hoveredManifestation?.id === manifestation.id && (
                                <div className="manifestation-tooltip">
                                    <div className="tooltip-text">{manifestation.intention}</div>
                                    <div className="tooltip-meta">
                                        <div className="tooltip-stage capitalized">{stage}</div>
                                        <div className="tooltip-sessions">Session {sessions}/9</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Ambient elements */}
                <div className="ambient-elements">
                    {/* Fireflies/sparkles */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="firefly"
                            style={{
                                left: `${20 + Math.random() * 60}% `,
                                top: `${20 + Math.random() * 60}% `,
                                animationDelay: `${Math.random() * 3} s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Garden Stats */}
            <div className="garden-stats">
                <div className="stat">
                    <Sparkles size={16} />
                    <span>{manifestations.length} Intentions</span>
                </div>
                <div className="stat">
                    <Heart size={16} />
                    <span>Stage: {treeStage}</span>
                </div>
                {onViewInsights && manifestations.length > 0 && (
                    <button className="insights-btn" onClick={onViewInsights}>
                        <BarChart3 size={16} />
                        <span>Insights</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export function SeedPlantingCeremony({ onComplete }) {
    const [stage, setStage] = useState('welcome'); // welcome, intention, planting, complete
    const [seedIntention, setSeedIntention] = useState('');

    const plantSeed = () => {
        setStage('planting');
        setTimeout(() => {
            setStage('complete');
            setTimeout(() => {
                onComplete(seedIntention || 'I believe in myself');
            }, 2000);
        }, 3000);
    };

    return (
        <div className="seed-ceremony">
            {stage === 'welcome' && (
                <div className="ceremony-stage fade-in">
                    <Sparkles size={60} className="ceremony-icon" />
                    <h2>Welcome to Your Garden</h2>
                    <p className="ceremony-text">
                        Every great journey begins with a single seed.
                        <br />
                        Let's plant yours together.
                    </p>
                    <button className="ceremony-btn" onClick={() => setStage('intention')}>
                        Begin
                    </button>
                </div>
            )}

            {stage === 'intention' && (
                <div className="ceremony-stage fade-in">
                    <h2>Plant Your Seed of Belief</h2>
                    <p className="ceremony-text">
                        What is the foundation of your manifestation practice?
                    </p>
                    <textarea
                        className="seed-intention-input"
                        placeholder="I believe in myself..."
                        value={seedIntention}
                        onChange={(e) => setSeedIntention(e.target.value)}
                        autoFocus
                    />
                    <button className="ceremony-btn" onClick={plantSeed}>
                        Plant Seed
                    </button>
                </div>
            )}

            {stage === 'planting' && (
                <div className="ceremony-stage fade-in">
                    <div className="planting-animation">
                        <div className="hands">
                            <div className="hand left"></div>
                            <div className="hand right"></div>
                        </div>
                        <div className="seed-being-planted">
                            <div className="seed-glow"></div>
                            <div className="seed"></div>
                        </div>
                        <div className="soil-particles">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="particle"></div>
                            ))}
                        </div>
                    </div>
                    <p className="ceremony-text">Planting your seed...</p>
                </div>
            )}

            {stage === 'complete' && (
                <div className="ceremony-stage fade-in">
                    <Sparkles size={60} className="ceremony-icon pulse" />
                    <h2>Your Seed is Planted</h2>
                    <p className="ceremony-text">
                        Nurture it with intention, water it with practice,
                        <br />
                        and watch your garden bloom.
                    </p>
                </div>
            )}
        </div>
    );
}
