import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import './ContactForm.css';

export function ContactForm({ onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create mailto link with form data
        const subject = encodeURIComponent(`OMNISYNC Contact: ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:ilovemyjiko@gmail.com?subject=${subject}&body=${body}`;

        setSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div className="contact-overlay" onClick={onClose}>
            <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                <button className="contact-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {!submitted ? (
                    <>
                        <div className="contact-header">
                            <Mail size={32} />
                            <h2>Contact Us</h2>
                            <p>We'd love to hear from you</p>
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <button type="submit" className="contact-submit">
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="contact-success">
                        <div className="success-icon">✓</div>
                        <h3>Opening your email client...</h3>
                        <p>Your message is ready to send!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
