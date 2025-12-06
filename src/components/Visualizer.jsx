import React, { useEffect, useState, useRef } from 'react';
import { Eye, Waves, Sparkles, Circle, BarChart3 } from 'lucide-react';
import './Visualizer.css';

export function Visualizer({ isPlaying, currentTrack }) {
    const [color, setColor] = useState('var(--accent-purple)');
    const [animationMode, setAnimationMode] = useState('idle'); // idle, breathe, pulse, flow
    const [visualMode, setVisualMode] = useState('ambient'); // ambient, waves, particles, mandala, spectrum
    const [showModeSelector, setShowModeSelector] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!currentTrack) {
            setColor('var(--accent-purple)');
            setAnimationMode('idle');
            return;
        }

        // Determine color based on frequency or type
        const freq = currentTrack.left || 0;
        let newColor = 'var(--accent-purple)';
        let mode = 'pulse';

        // Chakra-specific colors (traditional chakra color mapping)
        if (currentTrack.id === 'c1') { newColor = '#dc2626'; mode = 'breathe'; } // Root - Red
        else if (currentTrack.id === 'c2') { newColor = '#ea580c'; mode = 'breathe'; } // Sacral - Orange
        else if (currentTrack.id === 'c3') { newColor = '#eab308'; mode = 'breathe'; } // Solar Plexus - Yellow
        else if (currentTrack.id === 'c4') { newColor = '#16a34a'; mode = 'breathe'; } // Heart - Green
        else if (currentTrack.id === 'c5') { newColor = '#2563eb'; mode = 'breathe'; } // Throat - Blue
        else if (currentTrack.id === 'c6') { newColor = '#4f46e5'; mode = 'breathe'; } // Third Eye - Indigo
        else if (currentTrack.id === 'c7') { newColor = '#9333ea'; mode = 'breathe'; } // Crown - Violet
        else if (currentTrack.id.includes('energy-')) {
            // Use predefined colors for energy profiles
            if (currentTrack.id.includes('clarity')) newColor = '#1e3a8a'; // Blue
            else if (currentTrack.id.includes('strength')) newColor = '#7f1d1d'; // Red
            else if (currentTrack.id.includes('confidence')) newColor = '#c2410c'; // Orange
            else if (currentTrack.id.includes('love')) newColor = '#be185d'; // Pink
            else if (currentTrack.id.includes('peace')) newColor = '#4c1d95'; // Indigo
            else if (currentTrack.id.includes('protection')) newColor = '#581c87'; // Violet
            else if (currentTrack.id.includes('creativity')) newColor = '#b45309'; // Amber
            else if (currentTrack.id.includes('flow')) newColor = '#0f766e'; // Teal
            else if (currentTrack.id.includes('motivation')) newColor = '#be123c'; // Rose

            mode = 'breathe';
        } else if (freq > 0) {
            // Frequency-based mapping
            if (freq < 100) newColor = '#7f1d1d'; // Earthy Red
            else if (freq < 300) newColor = '#c2410c'; // Orange
            else if (freq < 400) newColor = '#b45309'; // Yellow/Amber
            else if (freq < 550) newColor = '#15803d'; // Green
            else if (freq < 700) newColor = '#0e7490'; // Cyan
            else if (freq < 850) newColor = '#1d4ed8'; // Blue
            else newColor = '#7e22ce'; // Purple
        }

        // Override for specific soundscapes
        if (currentTrack.type === 'ocean') { newColor = '#0c4a6e'; mode = 'flow'; }
        else if (currentTrack.type === 'rain') { newColor = '#334155'; mode = 'flow'; }
        else if (currentTrack.type === 'cosmic') { newColor = '#312e81'; mode = 'pulse'; }
        else if (currentTrack.type === 'earth') { newColor = '#3f2e22'; mode = 'breathe'; }

        setColor(newColor);
        setAnimationMode(isPlaying ? mode : 'idle');

    }, [currentTrack, isPlaying]);

    // Canvas-based visualizations
    useEffect(() => {
        if (!isPlaying || visualMode === 'ambient') {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const freq = currentTrack?.left || 432;
        const beatFreq = currentTrack?.beat || 10;

        if (visualMode === 'waves') {
            drawWaves(ctx, canvas, color, freq, beatFreq);
        } else if (visualMode === 'particles') {
            drawParticles(ctx, canvas, color, freq);
        } else if (visualMode === 'mandala') {
            drawMandala(ctx, canvas, color, beatFreq);
        } else if (visualMode === 'spectrum') {
            drawSpectrum(ctx, canvas, color, freq);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, visualMode, color, currentTrack]);

    const drawWaves = (ctx, canvas, color, freq, beatFreq) => {
        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.globalAlpha = 0.3 - i * 0.1;

                for (let x = 0; x < canvas.width; x += 5) {
                    const y = canvas.height / 2 +
                        Math.sin((x * 0.01) + (time * 0.05) + i) * (50 + beatFreq * 3) +
                        Math.sin((x * 0.005) + (time * 0.03)) * 30;

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            time++;
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const drawParticles = (ctx, canvas, color, freq) => {
        const particles = [];
        const particleCount = Math.min(100, Math.floor(freq / 5));

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color;
            particles.forEach(p => {
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const drawMandala = (ctx, canvas, color, beatFreq) => {
        let rotation = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation);

            const petals = 8;
            const radius = 100 + Math.sin(rotation * 2) * 20;

            for (let i = 0; i < petals; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 / petals) * i);

                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;

                ctx.beginPath();
                ctx.arc(0, radius, 40, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            ctx.restore();
            rotation += 0.005 + (beatFreq * 0.001);
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const drawSpectrum = (ctx, canvas, color, freq) => {
        let time = 0;
        const bars = 32;
        const barWidth = canvas.width / bars;

        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color;
            for (let i = 0; i < bars; i++) {
                const height = Math.abs(Math.sin(time * 0.05 + i * 0.5)) * (canvas.height / 2) *
                    (0.5 + Math.sin(freq * 0.01 + i) * 0.5);

                ctx.globalAlpha = 0.7;
                ctx.fillRect(
                    i * barWidth,
                    canvas.height - height,
                    barWidth - 2,
                    height
                );
            }

            time++;
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const visualModes = [
        { id: 'ambient', name: 'Ambient', icon: Eye },
        { id: 'waves', name: 'Waves', icon: Waves },
        { id: 'particles', name: 'Particles', icon: Sparkles },
        { id: 'mandala', name: 'Mandala', icon: Circle },
        { id: 'spectrum', name: 'Spectrum', icon: BarChart3 }
    ];

    return (
        <div className="visualizer-container">
            {/* Mode Selector */}
            <div className="visual-mode-selector">
                <button
                    className="mode-toggle-btn"
                    onClick={() => setShowModeSelector(!showModeSelector)}
                    title="Visualization Mode"
                >
                    {React.createElement(visualModes.find(m => m.id === visualMode)?.icon || Eye, { size: 20 })}
                </button>

                {showModeSelector && (
                    <div className="mode-options">
                        {visualModes.map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-option ${visualMode === mode.id ? 'active' : ''}`}
                                onClick={() => {
                                    setVisualMode(mode.id);
                                    setShowModeSelector(false);
                                }}
                            >
                                {React.createElement(mode.icon, { size: 18 })}
                                <span>{mode.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Canvas for advanced visualizations */}
            {visualMode !== 'ambient' && (
                <canvas ref={canvasRef} className="visualizer-canvas" />
            )}

            {/* Ambient mode (original) */}
            {visualMode === 'ambient' && (
                <>
                    <div
                        className={`visualizer-bg ${animationMode}`}
                        style={{ '--active-color': color }}
                    ></div>

                    {/* Central Breathing Element */}
                    {isPlaying && (
                        <div className="breathing-circle-container">
                            <div className="breathing-circle" style={{ borderColor: color, boxShadow: `0 0 40px ${color}` }}></div>
                            <div className="breathing-circle-inner" style={{ background: color }}></div>
                        </div>
                    )}

                    {/* Particle Overlay (CSS only) */}
                    {isPlaying && <div className="particles"></div>}
                </>
            )}
        </div>
    );
}
