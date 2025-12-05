import { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';
import './BreathingPacer.css';

export function BreathingPacer({ onClose }) {
    const [phase, setPhase] = useState('inhale');
    const [text, setText] = useState('Inhale');
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const cycle = () => {
            // Inhale (4s) - grow from 1 to 1.5
            setPhase('inhale');
            setText('Inhale');
            setScale(1);
            setTimeout(() => setScale(1.5), 50); // Trigger animation

            setTimeout(() => {
                // Hold (4s) - stay at 1.5
                setPhase('hold');
                setText('Hold');

                setTimeout(() => {
                    // Exhale (4s) - shrink from 1.5 to 1
                    setPhase('exhale');
                    setText('Exhale');
                    setScale(1);

                    setTimeout(() => {
                        // Hold (4s) - stay at 1
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
            <div className="breathing-overlay-content">
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
        </div>
    );
}
