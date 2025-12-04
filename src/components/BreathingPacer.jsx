import { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';
import './BreathingPacer.css';

export function BreathingPacer({ onClose }) {
    const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale', 'hold2'
    const [text, setText] = useState('Inhale');
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const cycle = () => {
            // Inhale (4s)
            setPhase('inhale');
            setText('Inhale');
            setScale(1.5);

            setTimeout(() => {
                // Hold (4s)
                setPhase('hold');
                setText('Hold');

                setTimeout(() => {
                    // Exhale (4s)
                    setPhase('exhale');
                    setText('Exhale');
                    setScale(1);

                    setTimeout(() => {
                        // Hold (4s) - Box Breathing
                        setPhase('hold2');
                        setText('Hold');
                    }, 4000);
                }, 4000);
            }, 4000);
        };

        cycle();
        const interval = setInterval(cycle, 16000); // 4+4+4+4 = 16s cycle

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="breathing-overlay">
            <button className="close-pacer-btn" onClick={onClose}>
                <X size={24} />
            </button>

            <div className="pacer-content">
                <div className="pacer-title">
                    <Wind size={24} />
                    <span>Box Breathing</span>
                </div>

                <div className={`breathing-circle ${phase}`} style={{ transform: `scale(${scale})` }}>
                    <div className="inner-text">{text}</div>
                </div>

                <div className="pacer-instruction">
                    Sync your breath with the circle
                </div>
            </div>
        </div>
    );
}
