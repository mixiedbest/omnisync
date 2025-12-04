import { useEffect, useState } from 'react';
import './Visualizer.css';

export function Visualizer({ isPlaying, currentTrack }) {
    const [color, setColor] = useState('var(--bg-dark)');
    const [animationMode, setAnimationMode] = useState('idle'); // idle, breathe, pulse, flow

    useEffect(() => {
        if (!currentTrack) {
            setColor('var(--bg-dark)');
            setAnimationMode('idle');
            return;
        }

        // Determine color based on frequency or type
        const freq = currentTrack.left || 0;
        let newColor = 'var(--bg-dark)';
        let mode = 'pulse';

        if (currentTrack.id.includes('energy-')) {
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
            if (freq < 100) newColor = '#3f2e22'; // Earthy Brown/Red
            else if (freq < 300) newColor = '#7c2d12'; // Orange/Red
            else if (freq < 400) newColor = '#b45309'; // Yellow/Orange
            else if (freq < 550) newColor = '#14532d'; // Green
            else if (freq < 700) newColor = '#0e7490'; // Blue/Teal
            else if (freq < 850) newColor = '#1e3a8a'; // Indigo
            else newColor = '#581c87'; // Violet
        }

        // Override for specific soundscapes
        if (currentTrack.type === 'ocean') { newColor = '#0c4a6e'; mode = 'flow'; }
        else if (currentTrack.type === 'rain') { newColor = '#334155'; mode = 'flow'; }
        else if (currentTrack.type === 'cosmic') { newColor = '#312e81'; mode = 'pulse'; }
        else if (currentTrack.type === 'earth') { newColor = '#3f2e22'; mode = 'breathe'; }

        setColor(newColor);
        setAnimationMode(isPlaying ? mode : 'idle');

    }, [currentTrack, isPlaying]);

    return (
        <div className="visualizer-container">
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
        </div>
    );
}
