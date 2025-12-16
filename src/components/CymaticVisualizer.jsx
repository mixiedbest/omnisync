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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let time = 0;

        const animate = () => {
            if (!canvas) return;

            // Resize canvas to full screen
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height / 2;

            // Fade effect for trails (laser persistence)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;

            time += 0.01 * speed;

            // Use the beat frequency to drive the math
            // Higher beat = faster vibration / more complexity
            const f = Math.max(1, beatFrequency) * 0.1;

            ctx.beginPath();

            if (mode === 'lissajous') {
                // Lissajous: Simulates laser reflecting off two vibrating mirrors
                const points = 500;
                for (let i = 0; i < points; i++) {
                    const t = time + (i * 0.05); // Trail length

                    // The ratio between A and B determines the shape
                    // We use the carrier frequency and beat frequency to create this ratio
                    const ratio = 1 + (f * 0.1);

                    const x = cx + Math.sin(t * ratio + complexity) * (Math.min(width, height) * 0.4);
                    const y = cy + Math.sin(t) * (Math.min(width, height) * 0.4);

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            } else if (mode === 'mandala') {
                // Cymatic Plate Simulation (Chladni patterns)
                const points = 360;
                const radius = Math.min(width, height) * 0.35;

                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * Math.PI * 2;

                    // Radial vibration
                    const vibration = Math.sin(angle * complexity + time) * Math.cos(angle * (complexity / 2) - time * 2);
                    const r = radius + (vibration * 50 * f);

                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            } else if (mode === 'wave') {
                // Oscilloscope / String vibration
                for (let i = 0; i < width; i += 2) {
                    const x = i;
                    // Superposition of waves
                    const input = (i * 0.01) + time;
                    const y = cy +
                        Math.sin(input * f) * 100 +
                        Math.sin(input * f * 1.5) * 50;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [color, beatFrequency, mode, speed, complexity]);

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
