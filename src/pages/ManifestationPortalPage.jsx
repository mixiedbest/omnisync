import { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import './ManifestationPortalPage.css';

export function ManifestationPortalPage({ onNavigate }) {
    const [stage, setStage] = useState('entrance'); // entrance, input, preset, portal, completion
    const [intention, setIntention] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [portalActive, setPortalActive] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    const presets = [
        {
            id: 'grounded',
            name: 'Grounded & Safe',
            glyph: '🌳',
            frequencies: [194, 256], // Root + φ
            breathPattern: { inhale: 4, hold: 2, exhale: 6 },
            visualStyle: 'heavy',
            color: '#8B4513'
        },
        {
            id: 'love',
            name: 'Open Heart / Love',
            glyph: '💚',
            frequencies: [639, 1034], // Heart + φ expansion
            breathPattern: { inhale: 5, hold: 2, exhale: 5 },
            visualStyle: 'torus',
            color: '#16a34a'
        },
        {
            id: 'creative',
            name: 'Creative Flow',
            glyph: '🌊',
            frequencies: [528, 741], // Creation frequencies
            breathPattern: { inhale: 4, hold: 1, exhale: 4 },
            visualStyle: 'flowing',
            color: '#2563eb'
        },
        {
            id: 'clarity',
            name: 'Clarity & Direction',
            glyph: '✨',
            frequencies: [852, 1379], // Third eye + φ
            breathPattern: { inhale: 4, hold: 3, exhale: 4 },
            visualStyle: 'geometric',
            color: '#4f46e5'
        },
        {
            id: 'abundance',
            name: 'Abundance / Expansion',
            glyph: '🌟',
            frequencies: [432, 699, 1131], // φ harmonic ladder
            breathPattern: { inhale: 6, hold: 2, exhale: 6 },
            visualStyle: 'spiral',
            color: '#eab308'
        }
    ];

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
        setStage('input');
    };

    const selectPreset = (presetId) => {
        setSelectedPreset(presetId);
        setTimeout(() => {
            setStage('portal');
            setPortalActive(true);
        }, 500);
    };

    const completeSession = () => {
        setStage('completion');
        setTimeout(() => {
            setStage('entrance');
            setIntention('');
            setSelectedPreset(null);
            setPortalActive(false);
        }, 5000);
    };

    return (
        <div className={`manifestation-portal ${stage}`}>
            {/* Entrance Stage */}
            {stage === 'entrance' && (
                <div className="portal-entrance fade-in">
                    <div className="spiral-aperture">
                        <Sparkles size={80} className="portal-icon" />
                    </div>
                    <h1>Manifestation Portal</h1>
                    <p className="portal-subtitle">Intention → Resonance → Embodiment</p>
                    <button className="enter-portal-btn" onClick={enterPortal}>
                        Enter the Portal
                    </button>
                </div>
            )}

            {/* Intention Input Stage */}
            {stage === 'input' && (
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
            )}

            {/* Preset Selection Stage */}
            {stage === 'preset' && (
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
                                <span className="glyph">{preset.glyph}</span>
                                <span className="preset-name">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Portal Active Stage */}
            {stage === 'portal' && (
                <div className="portal-active">
                    <canvas ref={canvasRef} className="portal-canvas" />
                    <button className="complete-btn" onClick={completeSession}>
                        Complete
                    </button>
                </div>
            )}

            {/* Completion Stage */}
            {stage === 'completion' && (
                <div className="completion-stage fade-in">
                    <div className="completion-message">
                        <Sparkles size={60} className="completion-icon" />
                        <h2>Intention received.</h2>
                        <p>Carry it with you.</p>
                    </div>
                </div>
            )}

            {/* Close button */}
            <button className="close-portal" onClick={() => onNavigate('home')}>
                <X size={24} />
            </button>
        </div>
    );
}
