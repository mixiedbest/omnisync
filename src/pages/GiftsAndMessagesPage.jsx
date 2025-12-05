import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Gift, MessageCircle, Music, Wind, Zap, Moon, Sun, Heart, Check } from 'lucide-react';
import './GiftsAndMessagesPage.css';

export function GiftsAndMessagesPage({ onBack }) {
    const [activeTab, setActiveTab] = useState('message'); // 'message' or 'gift'
    const [connections, setConnections] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [messageType, setMessageType] = useState('postcard'); // 'postcard' or 'affirmation'
    const [giftType, setGiftType] = useState('energy');
    const [customMessage, setCustomMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const savedConnections = localStorage.getItem('omnisync_connections');
        if (savedConnections) {
            setConnections(JSON.parse(savedConnections));
        }
    }, []);

    const giftOptions = [
        { id: 'energy', label: 'Energy Boost', icon: Zap, color: '#eab308', desc: 'Beta waves for focus & vitality' },
        { id: 'sleep', label: 'Deep Sleep', icon: Moon, color: '#8b5cf6', desc: 'Delta waves for restful slumber' },
        { id: 'calm', label: 'Inner Peace', icon: Wind, color: '#14b8a6', desc: 'Theta waves for deep relaxation' },
        { id: 'love', label: 'Heart Opening', icon: Heart, color: '#ec4899', desc: 'Solfeggio 639Hz for connection' },
        { id: 'clarity', label: 'Mental Clarity', icon: Sun, color: '#f97316', desc: 'Alpha waves for clear thinking' }
    ];

    const handleSend = () => {
        if (!selectedRecipient) return;

        setIsSending(true);

        // Simulate network delay
        setTimeout(() => {
            setIsSending(false);
            setShowSuccess(true);

            // Reset after success animation
            setTimeout(() => {
                setShowSuccess(false);
                setCustomMessage('');
                setSelectedRecipient(null);
            }, 2000);
        }, 1500);
    };

    const postcardOptions = [
        { id: 'thinking', label: 'Thinking of You', icon: Heart },
        { id: 'hugs', label: 'Sending Hugs', icon: Wind },
        { id: 'friend', label: 'Hi Friend', icon: MessageCircle },
        { id: 'love', label: 'I Love You', icon: Heart },
        { id: 'bday', label: 'Happy Birthday', icon: Gift },
        { id: 'proud', label: 'Proud of You', icon: Zap },
        { id: 'highfive', label: 'High Five', icon: Sun },
        { id: 'miss', label: 'I Miss You', icon: Moon },
        { id: 'befriends', label: "Let's Be Friends?", icon: Music }
    ];

    return (
        <div className="gifts-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Connections
            </button>

            <div className="gifts-header">
                <h1>
                    <Gift size={32} />
                    <span className="divider">/</span>
                    <MessageCircle size={32} />
                </h1>
                <h2>Send Energy & Sound</h2>
                <p>Share healing frequencies with your circle</p>
            </div>

            <div className="gifts-container">
                {/* Recipient Selection */}
                <div className="section-card recipient-section">
                    <h3>1. Choose Recipient</h3>
                    {connections.length === 0 ? (
                        <p className="no-connections">Add connections in the main hub to send gifts!</p>
                    ) : (
                        <div className="recipients-grid">
                            {connections.map(conn => (
                                <button
                                    key={conn.id}
                                    className={`recipient-btn ${selectedRecipient === conn.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRecipient(conn.id)}
                                    style={{ '--accent-color': conn.color }}
                                >
                                    <div className="recipient-avatar" style={{ background: conn.color }}>
                                        {conn.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="recipient-name">{conn.name}</span>
                                    {selectedRecipient === conn.id && <Check size={16} className="check-icon" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Type Selection */}
                <div className="section-card type-section">
                    <h3>2. Choose Type</h3>
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
                            onClick={() => setActiveTab('message')}
                        >
                            <MessageCircle size={18} />
                            Message Drop
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'gift' ? 'active' : ''}`}
                            onClick={() => setActiveTab('gift')}
                        >
                            <Gift size={18} />
                            Frequency Gift
                        </button>
                    </div>

                    <div className="type-content">
                        {activeTab === 'message' ? (
                            <div className="message-options">
                                <div className="option-toggle">
                                    <button
                                        className={`toggle-btn ${messageType === 'postcard' ? 'active' : ''}`}
                                        onClick={() => setMessageType('postcard')}
                                    >
                                        <Music size={16} /> Tone Postcard (15s)
                                    </button>
                                    <button
                                        className={`toggle-btn ${messageType === 'affirmation' ? 'active' : ''}`}
                                        onClick={() => setMessageType('affirmation')}
                                    >
                                        <MessageCircle size={16} /> Affirmation
                                    </button>
                                </div>

                                {messageType === 'postcard' ? (
                                    <div className="postcard-grid">
                                        {postcardOptions.map(opt => (
                                            <button
                                                key={opt.id}
                                                className={`postcard-option ${customMessage === opt.label ? 'selected' : ''}`}
                                                onClick={() => setCustomMessage(opt.label)}
                                            >
                                                <opt.icon size={18} />
                                                <span>{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <textarea
                                            className="message-input"
                                            placeholder="Write your affirmation..."
                                            value={customMessage}
                                            onChange={(e) => setCustomMessage(e.target.value)}
                                            maxLength={140}
                                        />
                                        <div className="char-count">{customMessage.length}/140</div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="gift-grid">
                                {giftOptions.map(gift => {
                                    const GiftIcon = gift.icon;
                                    return (
                                        <button
                                            key={gift.id}
                                            className={`gift-option ${giftType === gift.id ? 'selected' : ''}`}
                                            onClick={() => setGiftType(gift.id)}
                                            style={{ '--gift-color': gift.color }}
                                        >
                                            <div className="gift-icon-wrapper">
                                                <GiftIcon size={24} />
                                            </div>
                                            <span className="gift-label">{gift.label}</span>
                                            <span className="gift-desc">{gift.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Send Button */}
                <button
                    className={`send-action-btn ${isSending ? 'sending' : ''} ${showSuccess ? 'success' : ''}`}
                    onClick={handleSend}
                    disabled={!selectedRecipient || isSending || showSuccess}
                >
                    {showSuccess ? (
                        <>
                            <Check size={24} />
                            Sent Successfully!
                        </>
                    ) : isSending ? (
                        <>
                            <div className="spinner"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Send {activeTab === 'message' ? 'Message' : 'Gift'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
