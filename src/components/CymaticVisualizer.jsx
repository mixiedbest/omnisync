import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Maximize2, Settings, Palette } from 'lucide-react';
import './CymaticVisualizer.css';

export function CymaticVisualizer({ onClose, beatFrequency = 10, carrierFrequency = 432, trackTitle = '', noiseType = null }) {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [mode, setMode] = useState(noiseType ? 'particle' : 'lissajous');

    // Determine initial color based on frequency, title, or noise type
    const getInitialColor = () => {
        const title = trackTitle.toLowerCase();

        // NOISE COLORS
        if (noiseType) {
            if (noiseType.includes('white')) return '#ffffff';
            if (noiseType.includes('pink')) return '#ff69b4';
            if (noiseType.includes('brown')) return '#8b4513';
            if (noiseType === 'green' || title.includes('nature')) return '#22c55e';
            if (noiseType === 'blue' || title.includes('water')) return '#3b82f6';
            if (noiseType === 'violet') return '#8b5cf6';
            if (noiseType === 'dark' || noiseType === 'black') return '#334155'; // Dark slate
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
        if (noiseType) {
            setMode('particle'); // Switch to particle/noise mode for noises
        } else {
            setMode('lissajous'); // Default for binaural
        }
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

            ctx.lineWidth = noiseType ? 1.5 : 2;
            ctx.lineCap = 'round';
            ctx.shadowBlur = noiseType ? 20 : 10;
            ctx.shadowColor = color;
            ctx.strokeStyle = color;

            ctx.beginPath();

            // NOISE / SOUNDSCAPE VISUALIZATION
            if (noiseType || mode === 'particle') {
                // Generate Organic/Chaotic Geometry
                const points = 1000;

                // Frequency factor (High types = fast chaos, Low types = slow waves)
                // White/Blue/Violet = Fast
                // Pink/Brown/Dark = Slow
                const isHighFreq = ['white', 'blue', 'violet', 'grey'].some(t => noiseType?.includes(t));
                const speedMult = isHighFreq ? 0.3 : 0.05;
                const roughness = isHighFreq ? 50 : 5;

                time += speedMult;

                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2;

                    // Simplex-like noise simulation using superposed sines
                    const noiseVal = Math.sin(i * 0.1 + time) * Math.cos(i * 0.05 - time * 0.5) + Math.sin(time + i);

                    const r = scale * (0.8 + 0.3 * noiseVal);
                    // Add fuzz for high freq noises
                    const fuzz = isHighFreq ? (Math.random() - 0.5) * 20 : 0;

                    const x = cx + Math.cos(angle) * (r + fuzz);
                    const y = cy + Math.sin(angle) * (r + fuzz);

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                // Add random particles for "static" feel if white noise
                if (isHighFreq) {
                    for (let p = 0; p < 20; p++) {
                        const px = Math.random() * width;
                        const py = Math.random() * height;
                        ctx.moveTo(px, py);
                        ctx.lineTo(px + 2, py + 2);
                    }
                }
            }
            // BINAURAL VISUALIZATION (Real-Time Physics)
            else {
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
            }

            ctx.stroke();
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
