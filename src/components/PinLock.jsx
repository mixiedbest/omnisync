import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import './PinLock.css';

export function PinLock({ onUnlock, onCancel, title = "Enter PIN" }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);

            // Auto-submit when 4 digits entered
            if (newPin.length === 4) {
                setTimeout(() => verifyPin(newPin), 100);
            }
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    const verifyPin = (pinToVerify) => {
        const savedPin = localStorage.getItem('omnisync_pin');

        if (savedPin === pinToVerify) {
            onUnlock();
        } else {
            setError('Incorrect PIN');
            setPin('');
        }
    };

    return (
        <div className="pin-lock-overlay">
            <div className="pin-lock-container">
                <button className="pin-close-btn" onClick={onCancel}>
                    <X size={24} />
                </button>

                <div className="pin-header">
                    <Lock size={48} className="pin-lock-icon" />
                    <h2>{title}</h2>
                </div>

                <div className="pin-display">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                {error && <div className="pin-error">{error}</div>}

                <div className="pin-keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className="pin-key"
                            onClick={() => handleNumberClick(num.toString())}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="pin-key empty" disabled></button>
                    <button
                        className="pin-key"
                        onClick={() => handleNumberClick('0')}
                    >
                        0
                    </button>
                    <button
                        className="pin-key backspace"
                        onClick={handleBackspace}
                    >
                        ⌫
                    </button>
                </div>
            </div>
        </div>
    );
}

export function PinSetup({ onComplete, onCancel }) {
    const [step, setStep] = useState('enter'); // 'enter' or 'confirm'
    const [firstPin, setFirstPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const currentPin = step === 'enter' ? firstPin : confirmPin;
    const setCurrentPin = step === 'enter' ? setFirstPin : setConfirmPin;

    const handleNumberClick = (num) => {
        if (currentPin.length < 4) {
            const newPin = currentPin + num;
            setCurrentPin(newPin);

            // Auto-proceed when 4 digits entered
            if (newPin.length === 4) {
                setTimeout(() => {
                    if (step === 'enter') {
                        setStep('confirm');
                    } else {
                        verifyAndSave(newPin);
                    }
                }, 100);
            }
        }
    };

    const handleBackspace = () => {
        setCurrentPin(currentPin.slice(0, -1));
        setError('');
    };

    const verifyAndSave = (pin) => {
        if (pin === firstPin) {
            localStorage.setItem('omnisync_pin', pin);
            onComplete();
        } else {
            setError('PINs do not match');
            setConfirmPin('');
            setStep('enter');
            setFirstPin('');
        }
    };

    return (
        <div className="pin-lock-overlay">
            <div className="pin-lock-container">
                <button className="pin-close-btn" onClick={onCancel}>
                    <X size={24} />
                </button>

                <div className="pin-header">
                    <Lock size={48} className="pin-lock-icon" />
                    <h2>{step === 'enter' ? 'Create PIN' : 'Confirm PIN'}</h2>
                    <p className="pin-subtitle">
                        {step === 'enter' ? 'Enter a 4-digit PIN' : 'Re-enter your PIN'}
                    </p>
                </div>

                <div className="pin-display">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`pin-dot ${i < currentPin.length ? 'filled' : ''}`}
                        />
                    ))}
                </div>

                {error && <div className="pin-error">{error}</div>}

                <div className="pin-keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className="pin-key"
                            onClick={() => handleNumberClick(num.toString())}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="pin-key empty" disabled></button>
                    <button
                        className="pin-key"
                        onClick={() => handleNumberClick('0')}
                    >
                        0
                    </button>
                    <button
                        className="pin-key backspace"
                        onClick={handleBackspace}
                    >
                        ⌫
                    </button>
                </div>
            </div>
        </div>
    );
}
