import { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';
import './BreathingPacer.css';

export function BreathingPacer({ onClose }) {
    const [text, setText] = useState('Inhale');

    useEffect(() => {
        const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
        let step = 0;

        // Initial Set
        setText(phases[0]);

        const interval = setInterval(() => {
            step = (step + 1) % 4;
            setText(phases[step]);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="breathing-overlay">
            <div className="breathing-overlay-content">
                <button className="close-pacer-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="pacer-content">
                    <div className="pacer-title">
                        <Wind size={24} />
                        <span>Box Breathing</span>
                    </div>

                    <div className="breathing-circle animate-box">
                        <div className="inner-text">{text}</div>
                    </div>

                    <div className="pacer-instruction">
                        Sync your breath with the circle
                    </div>
                </div>
            </div>
        </div>
    );
}
