import React from 'react';
import { ArrowLeft, Activity, Globe, Heart, Wind, Sparkles } from 'lucide-react';
import './AboutPage.css';

export function AboutPage({ onBack }) {
    return (
        <div className="about-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Home
            </button>

            <div className="about-content">
                <header className="about-header">
                    <h1 className="about-title">The Science of Brainwaves</h1>
                    <p className="about-subtitle">Understanding the frequencies that shape your reality</p>
                </header>

                <section className="brainwaves-section">
                    <h2>Understanding Your Mind</h2>

                    <div className="brainwave-card">
                        <h3>Gamma (30–100+ Hz)</h3>
                        <p className="brainwave-subtitle">Peak Focus • Insight • Higher Consciousness</p>
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
                    <h2>Advanced Frequency Science</h2>
                    <p className="section-intro">
                        Beyond standard brainwaves, OmniSync integrates cutting-edge harmonic systems to target specific physical and energetic layers.
                    </p>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Activity size={24} />
                            <h3>Bio-Resonance (Nogier)</h3>
                        </div>
                        <p>
                            Developed by Dr. Paul Nogier, these frequencies correspond to embryonic tissue layers.
                            They are used to target specific physical systems like nerves <strong>(1168Hz)</strong>,
                            muscles, and cellular repair <strong>(292Hz)</strong>.
                        </p>
                    </div>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Activity size={24} />
                            <h3>Solfeggio Frequencies</h3>
                        </div>
                        <p>
                            An ancient 6-tone scale used in sacred music, believed to impart spiritual blessings.
                            Key tones include <strong>396Hz</strong> (Liberating Guilt), <strong>528Hz</strong> (Transformation/DNA Repair),
                            and <strong>852Hz</strong> (Awakening Intuition).
                        </p>
                    </div>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Globe size={24} />
                            <h3>Planetary Harmonics</h3>
                        </div>
                        <p>
                            Based on the orbital periods of celestial bodies (Hans Cousto's "Cosmic Octave").
                            Examples include <strong>Earth Year (Om)</strong> at 136.1Hz for grounding, or
                            <strong>Jupiter</strong> at 183.58Hz for expansion and abundance.
                        </p>
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
                    </div>

                    <div className="tech-card">
                        <h3>What Is Hemi-Sync®?</h3>
                        <p>
                            Hemi-sync uses layered tones and spatial sound design to bring the left and right hemispheres
                            of your brain into harmony. This creates a state often described as deeply relaxed but awake,
                            clear-minded, and spiritually open.
                        </p>
                    </div>
                </section>

                <section className="technology-section">
                    <h2>New Features & Protocols</h2>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Heart size={24} />
                            <h3>InnerSync: The Iso-Principle</h3>
                        </div>
                        <p>
                            The <strong>InnerSync</strong> feature uses the "Iso-Principle". Instead of forcing a happy state,
                            it meets you where you are (Matching), slowly ramps the frequency down (Pacing), and guides
                            you to your desired state (Leading).
                        </p>
                    </div>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Wind size={24} />
                            <h3>Vortex Breathing</h3>
                        </div>
                        <p>
                            Our unique <strong>Vortex</strong> pattern follows the Fibonacci Sequence. It starts with long,
                            deep breaths (13s) and progressively shortens, creating a "vacuum effect" that pulls you
                            into a zero-point state of focus.
                        </p>
                    </div>

                    <div className="tech-card">
                        <div className="card-header-icon">
                            <Sparkles size={24} />
                            <h3>3-Day Amplification Protocol</h3>
                        </div>
                        <div className="protocol-mini-steps">
                            <p><strong>Day 1 (Focus):</strong> Select ONE single intention.</p>
                            <p><strong>Day 2 (Saturation):</strong> Immerse in the feeling (3 sessions).</p>
                            <p><strong>Day 3 (Zero Contradiction):</strong> Live as if it is already done.</p>
                        </div>
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
                <section className="creators-section">
                    <h2>About the Creators</h2>

                    <div className="creators-intro">
                        <h3>JIKO</h3>
                        <p>
                            JIKO is the collaborative sound project of <strong>Mixie</strong> and <strong>Kenji</strong>: partners in music, healing, and life.
                            Together, they create art that bridges vibration, emotion, and intention. Their work blends the worlds of performance,
                            sound therapy, and modern spiritual exploration, and OMNISYNC is the next evolution of that journey.
                        </p>
                    </div>

                    <div className="creator-profile">
                        <h4>Mixie: DJ, artist, mother, and sound explorer</h4>
                        <p>
                            Mixie found her connection to the world through music: first through pop, rock, & hip-hop, and later through a deeper
                            understanding of vibration as a healing tool. As a DJ and artist, she's always been drawn to the emotional side of sound:
                            how frequencies move people, how rhythm reshapes energy, and how music can create community. As a mother, she believes in
                            accessibility, care, and creating tools that help people feel safe and held. Her vision drives OMNISYNC's purpose:
                            <strong> sound healing for everyone, no gatekeeping.</strong>
                        </p>
                    </div>

                    <div className="creator-profile">
                        <h4>Kenji: guitarist, musician, and music theory teacher</h4>
                        <p>
                            Kenji brings the technical and harmonic foundation of JIKO. With a background in guitar performance and music theory education,
                            he approaches sound with both precision and heart. His deep understanding of intervals, resonance, and harmonic architecture
                            shapes the way OMNISYNC blends frequency work with musicality. His goal is to make sound healing not just helpful, but
                            <strong> beautiful and musically honest.</strong>
                        </p>
                    </div>

                    <div className="mission-section">
                        <h3>Why We Created OMNISYNC</h3>
                        <p>
                            As JIKO, we believe that sound can shift how people feel, think, and heal. We've seen it in our music. We've seen it in our performances.
                            And we've lived it in our own lives.
                        </p>
                        <p>
                            But sound healing tools were either too expensive, too confusing, or too limited. Many people who could benefit from sound therapy
                            never had access to it.
                        </p>
                        <p>
                            So we built OMNISYNC — a place where <strong>science, spirituality, music, and intention</strong> come together.
                        </p>
                    </div>

                    <div className="mission-values">
                        <h3>Our Mission</h3>
                        <p>We believe sound should be:</p>
                        <ul className="values-list">
                            <li>✦ Accessible</li>
                            <li>✦ Inclusive</li>
                            <li>✦ Safe</li>
                            <li>✦ Beautiful</li>
                            <li>✦ Available to everyone</li>
                        </ul>
                    </div>
                </section>
            </div>

            <footer className="page-footer">
                © NeoTheory Music LLC & Mixie 2025 - v2.0 Quantum Build
            </footer>
        </div>
    );
}
