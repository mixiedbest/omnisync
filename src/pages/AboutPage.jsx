import { ArrowLeft } from 'lucide-react';
import './AboutPage.css';

export function AboutPage({ onBack }) {
    return (
        <div className="about-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Home
            </button>

            <div className="about-content">
                <h1 className="about-title">Understanding Brainwaves & Sound Healing</h1>

                <p className="about-intro">
                    Your mind is always active, even in stillness. Throughout the day, your brain shifts between
                    different brainwave states, each connected to a unique type of awareness. Our music and sound
                    experiences are designed to gently guide you into the state that best supports your intention:
                    focus, calm, rest, creativity, or deep healing.
                </p>

                <section className="brainwave-section">
                    <h2>Brainwave States</h2>

                    <div className="brainwave-card">
                        <h3>Gamma (30–100 Hz)</h3>
                        <p className="brainwave-subtitle">Peak Awareness • Expanded Consciousness</p>
                        <p>
                            Gamma waves appear during moments of insight, high-level information processing, and deep
                            compassion. This state is associated with "whole brain synchrony," where different regions
                            of the mind communicate at high speed.
                        </p>
                        <h4>Gamma frequencies support:</h4>
                        <ul>
                            <li>Heightened mental clarity</li>
                            <li>Deep spiritual awareness</li>
                            <li>Enhanced memory and learning</li>
                            <li>Feeling connected and "in flow"</li>
                        </ul>
                    </div>

                    <div className="brainwave-card">
                        <h3>Beta (12–30 Hz)</h3>
                        <p className="brainwave-subtitle">Active Thinking • Problem Solving</p>
                        <p>
                            Beta waves dominate your normal waking life: when you're focused, thinking, planning, or
                            navigating tasks. Balanced beta supports productivity and alertness, while excess beta can
                            feel like stress or overthinking.
                        </p>
                        <h4>Beta frequencies help with:</h4>
                        <ul>
                            <li>Focus and concentration</li>
                            <li>Mental energy</li>
                            <li>Clear thinking and decision-making</li>
                        </ul>
                    </div>

                    <div className="brainwave-card">
                        <h3>Alpha (8–12 Hz)</h3>
                        <p className="brainwave-subtitle">Relaxed • Creative • Lightly Meditative</p>
                        <p>
                            Alpha is the bridge between the conscious and subconscious mind. It's the state you drop
                            into when daydreaming, journaling, drawing, or unwinding.
                        </p>
                        <h4>Alpha frequencies are used for:</h4>
                        <ul>
                            <li>Stress relief</li>
                            <li>Mood balancing</li>
                            <li>Enhancing imagination and creativity</li>
                            <li>Opening the mind for manifestation work</li>
                        </ul>
                    </div>

                    <div className="brainwave-card">
                        <h3>Theta (4–8 Hz)</h3>
                        <p className="brainwave-subtitle">Deep Meditation • Intuition • Inner Vision</p>
                        <p>
                            Theta waves are present during dream states, hypnosis, and profound meditation. This is
                            where the subconscious opens and self-healing begins.
                        </p>
                        <h4>Theta frequencies support:</h4>
                        <ul>
                            <li>Deep emotional release</li>
                            <li>Trauma healing</li>
                            <li>Visualization and intuition</li>
                            <li>Accessing memory and insight</li>
                            <li>Spiritual connection and "inner journeying"</li>
                        </ul>
                    </div>

                    <div className="brainwave-card">
                        <h3>Delta (0.5–4 Hz)</h3>
                        <p className="brainwave-subtitle">Rest • Repair • Deep Sleep</p>
                        <p>
                            Delta waves are slow, powerful, and restorative. They appear in deep, dreamless sleep and
                            are linked with the body's natural healing processes.
                        </p>
                        <h4>Delta frequencies help with:</h4>
                        <ul>
                            <li>Deep relaxation</li>
                            <li>Sleep improvement</li>
                            <li>Nervous system repair</li>
                            <li>Immune support</li>
                        </ul>
                    </div>
                </section>

                <section className="technology-section">
                    <h2>How Sound Technology Supports You</h2>

                    <div className="tech-card">
                        <h3>What Are Binaural Beats?</h3>
                        <p>
                            Binaural beats occur when you listen to two slightly different tones: one in each ear.
                            Your brain responds by creating a third "phantom" frequency, allowing you to gently shift
                            into a desired brainwave state.
                        </p>
                        <div className="example-box">
                            <strong>Example:</strong><br />
                            Left ear: 200 Hz<br />
                            Right ear: 207 Hz<br />
                            Brain interprets: 7 Hz (theta range)
                        </div>
                        <h4>Benefits include:</h4>
                        <ul>
                            <li>Eases anxiety</li>
                            <li>Enhances meditation</li>
                            <li>Improves focus or sleep depending on the frequency</li>
                            <li>Supports mood and emotional balance</li>
                        </ul>
                        <p className="note">Headphones are recommended for full effect.</p>
                    </div>

                    <div className="tech-card">
                        <h3>What Is Hemi-Sync® (Hemispheric Synchronization)?</h3>
                        <p>
                            Hemi-sync is a method that uses layered tones, phase shifting, and spatial sound design
                            to bring the left and right hemispheres of your brain into harmony.
                        </p>
                        <p>This creates a balanced, synchronized state often described as:</p>
                        <ul>
                            <li>Deeply relaxed but awake</li>
                            <li>Clear-minded</li>
                            <li>Creative</li>
                            <li>Spiritually open</li>
                        </ul>
                        <p>
                            Hemi-sync techniques are used in meditation, healing, peak performance, and even therapeutic
                            practices to help people access deeper states safely and comfortably.
                        </p>
                    </div>
                </section>

                <section className="why-section">
                    <h2>Why We Use These Tools</h2>
                    <p>
                        The sounds in this app are crafted with intention: blending brainwave entrainment, healing
                        frequencies, and immersive musical design to help you:
                    </p>
                    <ul className="benefits-list">
                        <li>Relax your body</li>
                        <li>Calm your mind</li>
                        <li>Expand your awareness</li>
                        <li>Heal emotionally</li>
                        <li>Connect spiritually</li>
                        <li>Sleep deeply</li>
                    </ul>
                    <p className="closing">
                        Whether you're here to focus, meditate, or transform, these frequencies are tools to help
                        your mind and spirit work together.
                    </p>
                </section>
            </div>

            <footer className="page-footer">
                © NeoTheory Music LLC & Mixie 2025
            </footer>
        </div>
    );
}
