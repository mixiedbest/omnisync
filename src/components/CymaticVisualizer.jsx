import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Maximize2, Settings, Palette } from 'lucide-react';
import './CymaticVisualizer.css';

export function CymaticVisualizer({ onClose, beatFrequency = 10, carrierFrequency = 432, trackTitle = '', noiseType = null }) {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [mode, setMode] = useState(noiseType ? 'particle' : 'lissajous');
    const sandParticles = useRef([]);

    // Initialize sand particles
    useEffect(() => {
        if (sandParticles.current.length === 0) {
            for (let i = 0; i < 4000; i++) {
                sandParticles.current.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }, []);

    // Determine initial color based on frequency, title, or noise type
    const getInitialColor = () => {
        const title = trackTitle.toLowerCase();

        // NOISE & SOUNDSCAPE COLORS
        if (noiseType) {
            // Color Noises
            if (noiseType.includes('white')) return '#e2e8f0'; // Slate 200
            if (noiseType.includes('pink')) return '#f472b6'; // Pink 400
            if (noiseType.includes('brown')) return '#92400e'; // Amber 900
            if (noiseType.includes('green')) return '#16a34a'; // Green 600
            if (noiseType.includes('blue')) return '#2563eb'; // Blue 600
            if (noiseType.includes('violet')) return '#7c3aed'; // Violet 600
            if (noiseType.includes('grey')) return '#64748b'; // Slate 500

            // Soundscapes
            if (noiseType === 'ocean') return '#0ea5e9'; // Sky 500
            if (noiseType === 'rain') return '#3b82f6'; // Blue 500
            if (noiseType === 'cosmic') return '#8b5cf6'; // Violet 500
            if (noiseType === 'earth') return '#78350f'; // Amber 900

            return '#cccccc';
        }

        // BINAURAL COLORS
        const carrier = carrierFrequency;
        // Chakra / Solfeggio
        if (title.includes('root') || (carrier > 390 && carrier < 400)) return '#ff0000';
        if (title.includes('sacral') || (carrier > 410 && carrier < 425)) return '#ff7f00';
        if (title.includes('solar') || (carrier > 520 && carrier < 535)) return '#ffd700';
        if (title.includes('heart') || (carrier > 630 && carrier < 645)) return '#00ff00';
        if (title.includes('throat') || (carrier > 735 && carrier < 745)) return '#00ffff';
        if (title.includes('third eye') || (carrier > 845 && carrier < 855)) return '#4b0082';
        if (title.includes('crown') || (carrier > 960 && carrier < 970)) return '#8b00ff';

        // Brainwave State
        if (beatFrequency <= 4) return '#3b82f6';
        if (beatFrequency <= 8) return '#8b5cf6';
        if (beatFrequency <= 14) return '#10b981';
        if (beatFrequency <= 30) return '#f59e0b';
        return '#ef4444';
    };

    const [color, setColor] = useState(getInitialColor);
    const [showControls, setShowControls] = useState(true);

    // Update color if track changes
    useEffect(() => {
        setColor(getInitialColor());
        // We do NOT force mode changes anymore, allowing user preference to persist
    }, [beatFrequency, carrierFrequency, trackTitle, noiseType]);

    // Laser colors
    const laserColors = [
        { name: 'Argon Green', value: '#00ff00' },
        { name: 'Ruby Red', value: '#ff0000' },
        { name: 'Cobalt Blue', value: '#0000ff' },
        { name: 'Violet', value: '#aa00ff' },
        { name: 'Gold', value: '#ffd700' },
        { name: 'White', value: '#ffffff' }
    ];

    // Calculate interference based on explicit L/R or derived from carrier/beat
    const leftFreq = leftFrequency || (carrierFrequency - (beatFrequency / 2));
    const rightFreq = rightFrequency || (carrierFrequency + (beatFrequency / 2));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let time = 0;

        const animate = () => {
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;
            const scale = Math.min(width, height) * 0.35;

            // Deep space background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = noiseType ? 1.5 : 2;
            ctx.lineCap = 'round';
            ctx.shadowBlur = noiseType ? 15 : 10;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;
            ctx.fillStyle = color; // For sand particles

            ctx.beginPath();

            // PHYSICS ENGINE
            // Noise = Fast/Random Chaos. Binaural = Smooth/Harmonic Math.

            if (mode === 'chladni') {
                // --- CHLADNI PLATE (SAND) SIMULATION ---
                // m and n determine the complexity of the grid
                // We map frequencies to these integers/floats
                // Low freq = simple pattern (m=2), High freq = complex (m=10)
                const m = 2 + (leftFreq / 100);
                const n = 2 + (rightFreq / 100);

                sandParticles.current.forEach(p => {
                    // Safety check for HMR or init
                    if (typeof p.vx === 'undefined') p.vx = 0;
                    if (typeof p.vy === 'undefined') p.vy = 0;

                    // Normalize position to -1 to 1 based on center
                    const nx = (p.x - cx) / (scale * 1.5);
                    const ny = (p.y - cy) / (scale * 1.5);

                    const pi = Math.PI;
                    const val = Math.cos(n * pi * nx) * Math.cos(m * pi * ny) - Math.cos(m * pi * nx) * Math.cos(n * pi * ny);

                    const amp = Math.abs(val);

                    // NEWTONIAN PHYSICS
                    // 1. Friction (Damping) - stronger in nodes
                    const damping = 0.92;
                    p.vx *= damping;
                    p.vy *= damping;

                    // 2. Excitation (Force) - only where plate vibrates
                    if (amp > 0.05) {
                        const force = amp * 2.0; // Acceleration strength
                        p.vx += (Math.random() - 0.5) * force;
                        p.vy += (Math.random() - 0.5) * force;
                    }

                    // 3. Thermal Motion (keeps them alive)
                    p.vx += (Math.random() - 0.5) * 0.1;
                    p.vy += (Math.random() - 0.5) * 0.1;

                    // 4. Update Position
                    p.x += p.vx;
                    p.y += p.vy;

                    // 5. Bounds Check (Wrap around for continuous flow)
                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;

                    // Draw Particle
                    ctx.fillRect(p.x, p.y, 1.5, 1.5);
                });
                time += 0.05;

            } else if (noiseType) {
                // --- NOISE VISUALIZATION (Mode-Aware) ---
                time += 0.1; // Noise moves faster
                const points = 800;

                // Determine craziness based on noise type
                const isCalm = ['brown', 'green', 'ocean', 'earth'].some(t => noiseType.includes(t));
                const jitterAmt = isCalm ? 5 : 20;
                const waveSpeed = isCalm ? 0.2 : 1.0;

                if (mode === 'lissajous') {
                    // "Fuzzy Electron Cloud"
                    for (let i = 0; i < points; i++) {
                        const t = time + (i * 0.05);
                        // Lissajous base ...
                        const bx = Math.sin(t * 1.5);
                        const by = Math.sin(t * 1.2); // Slightly discordant ratio

                        // ... plus Noise Jitter
                        const noiseX = (Math.random() - 0.5) * jitterAmt;
                        const noiseY = (Math.random() - 0.5) * jitterAmt;

                        const x = cx + bx * scale + noiseX;
                        const y = cy + by * scale + noiseY;

                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                }
                else if (mode === 'mandala') {
                    // "Smoky Portal"
                    for (let i = 0; i <= 360; i++) {
                        const angle = (i / 360) * Math.PI * 2;
                        // Noise modulating radius
                        const noiseR = Math.sin(angle * 10 + time * waveSpeed) * Math.cos(angle * 4 - time);
                        const r = scale * (0.8 + 0.1 * noiseR) + (Math.random() * jitterAmt);

                        const x = cx + Math.cos(angle) * r;
                        const y = cy + Math.sin(angle) * r;

                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                }
                else if (mode === 'wave') {
                    // "Oscilloscope Static"
                    for (let i = 0; i < width; i += 5) {
                        const x = i;
                        // Base wave + Random Noise
                        const base = Math.sin(i * 0.01 + time);
                        const noise = (Math.random() - 0.5) * (isCalm ? 0.2 : 0.8);

                        const y = cy + (base + noise) * scale * 0.4;

                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                }
                // FALLBACK / DEFAULT "PARTICLE" MODE for Soundscapes
                else {
                    // Distinct Logic for Soundscapes
                    if (noiseType === 'rain') {
                        // Falling rain
                        for (let i = 0; i < 100; i++) {
                            const rx = Math.random() * width;
                            const ry = (Math.random() * height + time * 50) % height;
                            ctx.moveTo(rx, ry);
                            ctx.lineTo(rx, ry + 15); // Drop length
                        }
                    }
                    else if (noiseType === 'ocean') {
                        // Rolling horizontal waves
                        for (let i = 0; i < width; i += 10) {
                            const yOff = Math.sin(i * 0.01 + time) * 50 + Math.sin(i * 0.03 - time) * 30;
                            const y = cy + yOff;
                            if (i === 0) ctx.moveTo(i, y);
                            else ctx.lineTo(i, y);
                        }
                        // Second wave layer
                        for (let i = 0; i < width; i += 15) {
                            const yOff = Math.sin(i * 0.015 + time * 1.2) * 40;
                            const y = cy + yOff + 40;
                            ctx.moveTo(i, y); ctx.lineTo(i + 5, y);
                        }
                    }
                    else {
                        // Cosmic / General Noise (Starfield)
                        // Regenerate random points each frame for "static" look
                        const starCount = isCalm ? 300 : 1000;
                        for (let p = 0; p < starCount; p++) {
                            // Radial expansion effect
                            const ang = Math.random() * Math.PI * 2;
                            const dist = Math.random() * scale * 1.5;
                            const rx = cx + Math.cos(ang) * dist;
                            const ry = cy + Math.sin(ang) * dist;

                            // Flicker movement
                            const flicker = Math.random() * 2;
                            ctx.moveTo(rx, ry);
                            ctx.lineTo(rx + flicker, ry + flicker);
                        }
                    }
                }
                ctx.stroke();

            } else {
                // --- BINAURAL VISUALIZATION (Pure Physics) ---
                // Advance time for the next frame
                // We advance essentially "one frame's worth" of simulation time
                time += 0.05; // Base speed
                const timeStep = 0.005;
                const frameDuration = 0.5;

                for (let t = 0; t < frameDuration; t += timeStep) {
                    const simTime = time + t;
                    let x, y;

                    if (mode === 'lissajous') {
                        const fScale = 0.05;
                        x = cx + scale * Math.sin(simTime * leftFreq * fScale);
                        y = cy + scale * Math.sin(simTime * rightFreq * fScale);

                    } else if (mode === 'mandala') {
                        const angle = (simTime * leftFreq * 0.05) % (Math.PI * 2);
                        const r = scale * (0.8 + 0.2 * Math.sin(simTime * rightFreq * 0.05));
                        x = cx + Math.cos(angle) * r;
                        y = cy + Math.sin(angle) * r;

                    } else if (mode === 'wave') {
                        x = (simTime * 500) % width;
                        const combinedAmp = Math.sin(simTime * leftFreq * 0.05) + Math.sin(simTime * rightFreq * 0.05);
                        y = cy + combinedAmp * scale * 0.4;
                        if (x < 10) ctx.moveTo(x, y);
                    }

                    if (t === 0 && mode !== 'wave') ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [color, leftFreq, rightFreq, mode, noiseType]);

    // Manual Positioning & Scroll Lock
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const overlay = document.querySelector('.cymatic-overlay');
        if (overlay) {
            overlay.style.position = 'absolute';
            overlay.style.top = `${window.scrollY}px`;
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = `${window.innerHeight}px`;
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    // Compute display label
    // Compute display label
    const getDriverLabel = () => {
        if (noiseType) {
            return noiseType.charAt(0).toUpperCase() + noiseType.slice(1) + (noiseType.includes('noise') ? '' : ' Ambience');
        }

        // Calculate theoretical harmonic beat (e.g. for Phi Pairs: 641 - 396 = 245)
        const diff = Math.abs(rightFreq - leftFreq);
        if (diff > 0.1) {
            return `${diff.toFixed(2)} Hz Harmonic`;
        }

        if (beatFrequency && beatFrequency > 0) {
            return `${beatFrequency} Hz Beat`;
        }
        if (carrierFrequency) {
            return `${carrierFrequency} Hz Tone`;
        }
        return 'Signal';
    };

    return createPortal(
        <div className="cymatic-overlay">
            <canvas ref={canvasRef} className="cymatic-canvas" />

            {/* Controls Overlay */}
            <div className={`cymatic-controls ${showControls ? 'visible' : 'hidden'}`}>
                <div className="cymatic-header">
                    <h3>Laser Cymatics</h3>
                    <div className="freq-display">
                        <span className="label">Driven by:</span>
                        <span className="value">{getDriverLabel()}</span>
                    </div>
                </div>

                <div className="control-group">
                    <label>Mode</label>
                    <div className="mode-selector">
                        <button
                            className={mode === 'lissajous' ? 'active' : ''}
                            onClick={() => setMode('lissajous')}
                        >Lissajous</button>
                        <button
                            className={mode === 'mandala' ? 'active' : ''}
                            onClick={() => setMode('mandala')}
                        >Mandala</button>
                        <button
                            className={mode === 'wave' ? 'active' : ''}
                            onClick={() => setMode('wave')}
                        >Wave</button>
                        <button
                            className={mode === 'chladni' ? 'active' : ''}
                            onClick={() => setMode('chladni')}
                        >Sand</button>
                    </div>
                </div>

                <div className="control-group">
                    <label>Laser Color</label>
                    <div className="color-selector">
                        {laserColors.map(c => (
                            <button
                                key={c.name}
                                className={`color-dot ${color === c.value ? 'active' : ''}`}
                                style={{ backgroundColor: c.value }}
                                onClick={() => setColor(c.value)}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fab-container">
                <button
                    className="fab-btn"
                    onClick={() => setShowControls(!showControls)}
                    title="Toggle Controls"
                >
                    <Settings size={24} />
                </button>
                <button
                    className="fab-btn close"
                    onClick={onClose}
                    title="Close"
                >
                    <X size={24} />
                </button>
            </div>
        </div>,
        document.body
    );
}
