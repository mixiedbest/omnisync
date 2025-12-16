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
    const leftFreq = carrierFrequency - (beatFrequency / 2);
    const rightFreq = carrierFrequency + (beatFrequency / 2);

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

            ctx.lineWidth = 2; // Thinner line for high-freq detail
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;

            ctx.beginPath();

            // PHYSICS ENGINE: REAL-TIME LASER PATH
            // A frame is approx 16ms (0.016s).
            // A 100Hz wave completes 1.6 cycles in that time.
            // To see the "shape" clearly without it being a solid block of light,
            // we slow down the "time domain" slightly, but keep the RATIO exact.
            // This is equivalent to using a stroboscope or a high-speed camera.

            const timeStep = 0.005; // High resolution drawing
            const frameDuration = 0.5; // Draw a longer trail per frame for continuity

            // We draw the path the "laser" takes during this frame
            for (let t = 0; t < frameDuration; t += timeStep) {
                // Current simulation time
                const simTime = time + t;

                let x, y;

                if (mode === 'lissajous') {
                    // X = Left Ear Wave, Y = Right Ear Wave
                    // We scale the frequency down (e.g. * 0.1) to make the motion perceivable
                    // as a shape rather than a blur, while preserving the interference pattern.
                    const fScale = 0.05;
                    x = cx + scale * Math.sin(simTime * leftFreq * fScale);
                    y = cy + scale * Math.sin(simTime * rightFreq * fScale);

                } else if (mode === 'mandala') {
                    // Radial Standing Wave
                    const angle = (simTime * leftFreq * 0.05) % (Math.PI * 2);
                    const r = scale * (0.8 + 0.2 * Math.sin(simTime * rightFreq * 0.05));
                    x = cx + Math.cos(angle) * r;
                    y = cy + Math.sin(angle) * r;

                } else if (mode === 'wave') {
                    // Oscilloscope View (Time vs Amplitude)
                    // We map 'x' to time and 'y' to the combined waveform
                    x = (simTime * 500) % width;
                    const combinedAmp = Math.sin(simTime * leftFreq * 0.05) + Math.sin(simTime * rightFreq * 0.05);
                    y = cy + combinedAmp * scale * 0.4;

                    // Discontinuous jump handling for wave wrap-around
                    if (x < 10) ctx.moveTo(x, y);
                }

                if (t === 0 && mode !== 'wave') ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Advance time for the next frame
            // We advance essentially "one frame's worth" of simulation time
            time += 0.05;

            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [color, leftFreq, rightFreq, mode]);

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
