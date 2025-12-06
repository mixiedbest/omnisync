import { useEffect, useState } from 'react';
import './Visualizer.css';

export function Visualizer({ isPlaying, currentTrack }) {
    const [color, setColor] = useState('var(--accent-purple)');
    const [animationMode, setAnimationMode] = useState('idle'); // idle, breathe, pulse, flow

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
            if (freq < 100) newColor = '#7f1d1d'; // Earthy Red (was brown, made more vibrant)
            else if (freq < 300) newColor = '#c2410c'; // Orange
            else if (freq < 400) newColor = '#b45309'; // Yellow/Amber
            else if (freq < 550) newColor = '#15803d'; // Green (more vibrant)
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
