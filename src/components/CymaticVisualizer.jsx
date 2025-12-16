import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Maximize2, Settings, Palette } from 'lucide-react';
import './CymaticVisualizer.css';

export function CymaticVisualizer({ onClose, beatFrequency = 10, carrierFrequency = 432, trackTitle = '' }) {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [mode, setMode] = useState('lissajous');

    // Determine initial color based on frequency or title
    const getInitialColor = () => {
        const title = trackTitle.toLowerCase();
        const carrier = carrierFrequency;

        // Chakra / Solfeggio Colors
        if (title.includes('root') || (carrier > 390 && carrier < 400)) return '#ff0000'; // Red (Root/396)
        if (title.includes('sacral') || (carrier > 410 && carrier < 425)) return '#ff7f00'; // Orange (Sacral/417)
        if (title.includes('solar') || (carrier > 520 && carrier < 535)) return '#ffd700'; // Gold/Yellow (Solar/528)
        if (title.includes('heart') || (carrier > 630 && carrier < 645)) return '#00ff00'; // Green (Heart/639)
        if (title.includes('throat') || (carrier > 735 && carrier < 745)) return '#00ffff'; // Blue (Throat/741)
        if (title.includes('third eye') || (carrier > 845 && carrier < 855)) return '#4b0082'; // Indigo (Third Eye/852)
        if (title.includes('crown') || (carrier > 960 && carrier < 970)) return '#8b00ff'; // Violet (Crown/963)

        // Brainwave State Colors (Fallback)
        if (beatFrequency <= 4) return '#3b82f6'; // Delta - Blue
        if (beatFrequency <= 8) return '#8b5cf6'; // Theta - Purple
        if (beatFrequency <= 14) return '#10b981'; // Alpha - Green
        if (beatFrequency <= 30) return '#f59e0b'; // Beta - Orange
        return '#ef4444'; // Gamma - Red
    };

    const [color, setColor] = useState(getInitialColor);
    const [speed, setSpeed] = useState(1);
    const [complexity, setComplexity] = useState(5);
    const [showControls, setShowControls] = useState(true);

    // Laser colors
    const laserColors = [
        { name: 'Argon Green', value: '#00ff00' },
        { name: 'Ruby Red', value: '#ff0000' },
        { name: 'Cobalt Blue', value: '#0000ff' },
        { name: 'Violet', value: '#aa00ff' },
        { name: 'Gold', value: '#ffd700' },
        { name: 'White', value: '#ffffff' }
    ];

    // Calculate the exact physics of the interference
    // Lissajous figures are defined by the ratio between vertical and horizontal frequencies
    const leftFreq = carrierFrequency - (beatFrequency / 2);
    const rightFreq = carrierFrequency + (beatFrequency / 2);
    // Determine the harmonic ratio (e.g., 204Hz / 200Hz = 1.02)
    const harmonicRatio = rightFreq / leftFreq;

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

            // Laser glow settings
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;

            // Time step
            time += 0.02 * speed;

            ctx.beginPath();

            if (mode === 'lissajous') {
                // THE REAL PHYSICS:
                // X Axis oscillates at the Left Frequency
                // Y Axis oscillates at the Right Frequency
                // The "beat" comes from the difference between them.
                // We scale time to make it visible (otherwise it blurs).

                const points = 800;
                for (let i = 0; i < points; i++) {
                    // t represents the phase of the wave
                    const t = time + (i * 0.01);

                    // Simple Lissajous: x = A*sin(at), y = B*sin(bt)
                    // Here 'a' is 1 (base) and 'b' is the harmonicRatio
                    const x = cx + scale * Math.sin(t);
                    const y = cy + scale * Math.sin(t * harmonicRatio);

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            } else if (mode === 'mandala') {
                // Radial Interference (Chladni Plate Simulation)
                const points = 360;
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;

                    // Interference pattern forming standing waves on a circle
                    // We use the harmonic ratio to drive the modulation
                    const wave1 = Math.sin(angle * 4 + time); // Base geometry
                    const waveInterference = Math.sin(angle * 4 * harmonicRatio - time); // Interference layer

                    const r = scale + (wave1 * waveInterference * 50 * complexity * 0.2);

                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            } else if (mode === 'wave') {
                // True Wave Interference
                for (let i = 0; i < width; i += 2) {
                    const x = i;
                    // Normalized position (-PI to PI)
                    const phase = (i / width) * Math.PI * 4;

                    // Superposition: Wave 1 + Wave 2
                    // Wave 2 is faster/slower by the harmonic ratio
                    const y1 = Math.sin(phase + time);
                    const y2 = Math.sin(phase * harmonicRatio + time);
                    const combined = (y1 + y2) * scale * 0.3; // Constructive/Destructive interference

                    const y = cy + combined;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [color, harmonicRatio, mode, speed, complexity]);

    return createPortal(
        <div className="cymatic-overlay">
            <canvas ref={canvasRef} className="cymatic-canvas" />

            {/* Controls Overlay */}
            <div className={`cymatic-controls ${showControls ? 'visible' : 'hidden'}`}>
                <div className="cymatic-header">
                    <h3>Laser Cymatics</h3>
                    <div className="freq-display">
                        <span className="label">Driven by:</span>
                        <span className="value">{beatFrequency} Hz</span>
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

                <div className="control-group">
                    <label>Complexity</label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.1"
                        value={complexity}
                        onChange={(e) => setComplexity(parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label>Speed</label>
                    <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
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
