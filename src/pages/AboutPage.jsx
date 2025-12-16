import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import './AboutPage.css';

export function AboutPage({ onBack }) {
    const [expandedSection, setExpandedSection] = useState('brainwaves'); // 'brainwaves' or 'creators'

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="about-page">
            <button className="back-button" onClick={onBack}>
                <ArrowLeft size={20} />
                Back to Home
            </button>

            <div className="about-content">
                <h1 className="about-title">About OMNISYNC</h1>

                {/* Section 1: Brainwaves & Sound Healing */}
                <div className="expandable-section">
                    <button
                        className={`section-header ${expandedSection === 'brainwaves' ? 'active' : ''}`}
                        onClick={() => toggleSection('brainwaves')}
                    >
                        <h2>Learn About Brainwaves & Sound Healing</h2>
                        {expandedSection === 'brainwaves' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {expandedSection === 'brainwaves' && (
                        <div className="section-content fade-in">
                            <p className="about-intro">
                                Your mind is always active, even in stillness. Throughout the day, your brain shifts between
                                different brainwave states, each connected to a unique type of awareness. Our music and sound
                                experiences are designed to gently guide you into the state that best supports your intention:
                                focus, calm, rest, creativity, or deep healing.
                            </p>

                            <section className="brainwave-section">
                                <h3>Brainwave States</h3>

                                <div className="brainwave-card">
                                    <h4>Delta (0.5-4 Hz)</h4>
                                    <p className="brainwave-subtitle">Rest, Repair, Deep Sleep</p>
                                    <p>
                                        Delta waves are slow, powerful, and restorative. They appear in deep, dreamless sleep and
                                        are linked with the body's natural healing processes.
                                    </p>
                                    <h5>Delta frequencies help with:</h5>
                                    <ul>
                                        <li>Deep relaxation</li>
                                        <li>Sleep improvement</li>
                                        <li>Nervous system repair</li>
                                        <li>Immune support</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Theta (4-8 Hz)</h4>
                                    <p className="brainwave-subtitle">Deep Meditation, Intuition, Inner Vision</p>
                                    <p>
                                        Theta waves are present during dream states, hypnosis, and profound meditation. This is
                                        where the subconscious opens and self-healing begins.
                                    </p>
                                    <h5>Theta frequencies support:</h5>
                                    <ul>
                                        <li>Deep emotional release</li>
                                        <li>Trauma healing</li>
                                        <li>Visualization and intuition</li>
                                        <li>Accessing memory and insight</li>
                                        <li>Spiritual connection and "inner journeying"</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Alpha (8-12 Hz)</h4>
                                    <p className="brainwave-subtitle">Relaxed, Creative, Lightly Meditative</p>
                                    <p>
                                        Alpha is the bridge between the conscious and subconscious mind. It's the state you drop
                                        into when daydreaming, journaling, drawing, or unwinding.
                                    </p>
                                    <h5>Alpha frequencies are used for:</h5>
                                    <ul>
                                        <li>Stress relief</li>
                                        <li>Mood balancing</li>
                                        <li>Enhancing imagination and creativity</li>
                                        <li>Opening the mind for manifestation work</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Beta (12-30 Hz)</h4>
                                    <p className="brainwave-subtitle">Active Thinking, Problem Solving</p>
                                    <p>
                                        Beta waves dominate your normal waking life: when you're focused, thinking, planning, or
                                        navigating tasks. Balanced beta supports productivity and alertness, while excess beta can
                                        feel like stress or overthinking.
                                    </p>
                                    <h5>Beta frequencies help with:</h5>
                                    <ul>
                                        <li>Focus and concentration</li>
                                        <li>Mental energy</li>
                                        <li>Clear thinking and decision-making</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Gamma (30-100 Hz)</h4>
                                    <p className="brainwave-subtitle">Peak Awareness, Expanded Consciousness</p>
                                    <p>
                                        Gamma waves appear during moments of insight, high-level information processing, and deep
                                        compassion. This state is associated with "whole brain synchrony," where different regions
                                        of the mind communicate at high speed.
                                    </p>
                                    <h5>Gamma frequencies support:</h5>
                                    <ul>
                                        <li>Heightened mental clarity</li>
                                        <li>Deep spiritual awareness</li>
                                        <li>Enhanced memory and learning</li>
                                        <li>Feeling connected and "in flow"</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="color-noise-section">
                                <h3>About Color Noises</h3>

                                <div className="tech-card">
                                    <p>
                                        Color noises are natural sound textures used to calm the mind, support focus, and create
                                        soothing environments. Each "color" represents the way energy is distributed across
                                        frequencies—similar to how colors in light carry different wavelengths.
                                    </p>
                                    <p>
                                        These gentle sound layers don't guide your brainwaves like binaural beats; instead, they
                                        create a steady sonic atmosphere that helps the nervous system relax and settle.
                                    </p>

                                    <h5>Different colors have different effects:</h5>
                                    <ul>
                                        <li><strong>White noise</strong> masks background distractions and helps with sleep.</li>
                                        <li><strong>Pink and brown noise</strong> offer warm, grounding tones ideal for deep rest, anxiety relief, and emotional balance.</li>
                                        <li><strong>Green noise</strong> brings the feel of forests and oceans, supporting stress reduction and natural harmony.</li>
                                        <li><strong>Blue and violet noises</strong> emphasize higher frequencies, often used for alertness or tinnitus relief.</li>
                                        <li><strong>Grey noise</strong> matches human hearing sensitivity and provides a neutral, soothing mask for overstimulation.</li>
                                    </ul>

                                    <p className="note">
                                        Color noises are simple, powerful, and safe for all ages. In OMNISYNC, we use them as a
                                        foundation for calm—helping you drift into sleep, focus on your work, or relax your
                                        nervous system anytime you need a soft sonic reset.
                                    </p>
                                </div>
                            </section>

                            <section className="technology-section">
                                <h3>How Sound Technology Supports You</h3>

                                <div className="tech-card">
                                    <h4>What Are Binaural Beats?</h4>
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
                                    <h5>Benefits include:</h5>
                                    <ul>
                                        <li>Eases anxiety</li>
                                        <li>Enhances meditation</li>
                                        <li>Improves focus or sleep depending on the frequency</li>
                                        <li>Supports mood and emotional balance</li>
                                    </ul>
                                    <p className="note">Headphones are recommended for full effect.</p>
                                </div>

                                <div className="tech-card">
                                    <h4>What Is Hemi-Sync® (Hemispheric Synchronization)?</h4>
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
                        </div>
                    )}
                </div>

                {/* Section 2: Breathing Techniques */}
                <div className="expandable-section">
                    <button
                        className={`section-header ${expandedSection === 'breathing' ? 'active' : ''}`}
                        onClick={() => toggleSection('breathing')}
                    >
                        <h2>Breathing Techniques</h2>
                        {expandedSection === 'breathing' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {expandedSection === 'breathing' && (
                        <div className="section-content fade-in">
                            <p className="about-intro">
                                Breathing is the one system in the body that works automatically and can be consciously controlled:
                                a bridge between the unconscious mind and intentional awareness. When you learn how to breathe well,
                                you gain direct access to your nervous system, your emotional state, and even your energy levels.
                            </p>

                            <section className="brainwave-section">
                                <div className="brainwave-card">
                                    <h4>4–7–8 Breathing (The Nervous System Reset)</h4>
                                    <p>
                                        The 4–7–8 breath is designed to gently slow the body and calm the mind. You inhale for 4 seconds,
                                        hold for 7, and exhale for 8. This long exhale activates the parasympathetic nervous system:
                                        the body's natural "rest & restore" mode, helping reduce stress, soften anxiety, and make it
                                        easier to fall asleep. Think of it as a built-in reset for your internal rhythm.
                                    </p>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Box Breathing (The Stabilizer)</h4>
                                    <p>
                                        Box Breathing follows a simple pattern: inhale 4, hold 4, exhale 4, hold 4. Athletes, performers,
                                        and the military use this to sharpen focus under pressure. This technique balances the breath,
                                        steadies the heart rate, and clears mental clutter. It's perfect for grounding, centering, and
                                        bringing the mind back into alignment with the present moment.
                                    </p>
                                </div>

                                <div className="brainwave-card">
                                    <h4>7-11 Deep Calm (The Anxiety Anchor)</h4>
                                    <p>
                                        This powerful pattern uses a 7-second inhale and a deeply extended 11-second exhale.
                                        By breathing out significantly longer than you breathe in, you send a direct biological signal
                                        to your brain that you are safe. This triggers a rapid parasympathetic response ("rest and digest"),
                                        making it one of the most effective tools for stopping panic attacks, lowering high stress immediately,
                                        and grounding yourself during intense emotion.
                                    </p>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Coherent Breathing (5–5) (The Harmony Breath)</h4>
                                    <p>
                                        Coherent breathing means breathing in for 5 seconds and out for 5: a smooth, balanced rhythm
                                        that naturally synchronizes heart and mind. This steady pace increases heart-rate variability (HRV),
                                        which is linked to emotional regulation, deep calm, and improved mood. It's one of the simplest
                                        ways to regulate your whole system and return to inner equilibrium.
                                    </p>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Energizing Breath (3–3–6) (The Activation Breath)</h4>
                                    <p>
                                        This breath uses a shorter inhale (3), short hold (3), and a longer exhale (6). The extended
                                        release clears carbon dioxide efficiently and brings fresh oxygen into muscles and brain. It wakes
                                        up your system without creating jitteriness: offering clean, grounded energy ideal for morning
                                        routines, creativity sessions, or moments when you need a natural lift.
                                    </p>
                                </div>
                            </section>

                            <section className="technology-section">
                                <h3>Why Learning to Breathe Is Important</h3>
                                <div className="tech-card">
                                    <p>
                                        Most people spend their lives breathing shallowly without realizing it. Relearning how to breathe
                                        is like rediscovering a built-in healing system your body has had all along.
                                    </p>
                                    <h5>Intentional breathing can:</h5>
                                    <ul>
                                        <li>Reduce stress and anxiety by calming the vagus nerve</li>
                                        <li>Improve sleep and rest quality</li>
                                        <li>Increase focus and mental clarity</li>
                                        <li>Support digestion and the immune system</li>
                                        <li>Balance emotions and reduce reactivity</li>
                                        <li>Enhance meditation, creativity, and intuitive awareness</li>
                                        <li>Regulate heart rate and blood pressure</li>
                                        <li>Deepen the effects of healing sound, frequencies, and relaxation practices</li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Section 3: The Golden Ratio */}
                <div className="expandable-section">
                    <button
                        className={`section-header ${expandedSection === 'golden' ? 'active' : ''}`}
                        onClick={() => toggleSection('golden')}
                    >
                        <h2>The Golden Ratio (φ) in Sound Healing</h2>
                        {expandedSection === 'golden' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {expandedSection === 'golden' && (
                        <div className="section-content fade-in">
                            <p className="about-intro">
                                The Golden Ratio (φ ≈ 1.618) is a mathematical constant found throughout nature, art, and music.
                                When applied to sound frequencies and timing, it creates naturally harmonious, organic relationships
                                that resonate deeply with the human body and mind.
                            </p>

                            <section className="brainwave-section">
                                <h3>What is the Golden Ratio?</h3>

                                <div className="brainwave-card">
                                    <h4>The Divine Proportion</h4>
                                    <p>
                                        The Golden Ratio appears when a line is divided so that the whole length divided by the long part
                                        equals the long part divided by the short part. This ratio (approximately 1.618:1) creates a sense
                                        of perfect balance and beauty.
                                    </p>
                                    <p>
                                        You'll find φ in:
                                    </p>
                                    <ul>
                                        <li>The spiral of a nautilus shell</li>
                                        <li>The arrangement of flower petals</li>
                                        <li>The proportions of the human body</li>
                                        <li>Classical architecture and art</li>
                                        <li>Musical compositions and intervals</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>φ-Scaled Frequencies</h4>
                                    <p>
                                        In OMNISYNC, we use the Golden Ratio to create frequency relationships that feel naturally balanced.
                                        Starting from a base frequency (like 432 Hz), we multiply or divide by φ to generate harmonics:
                                    </p>
                                    <ul>
                                        <li><strong>432 Hz × φ = 699 Hz</strong> (Heart Coherence)</li>
                                        <li><strong>699 Hz × φ = 1131 Hz</strong> (Higher Awareness)</li>
                                        <li><strong>432 Hz ÷ φ = 267 Hz</strong> (Grounding Calm)</li>
                                    </ul>
                                    <p>
                                        These φ-scaled frequencies create organic, non-linear progressions that mirror patterns found in nature,
                                        making them particularly effective for meditation and healing.
                                    </p>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Golden Ratio Breathing</h4>
                                    <p>
                                        Our Golden Ratio breathing pattern uses φ-timed intervals: 4 seconds inhale, 6.5 seconds exhale.
                                        This creates an approximate 1.618:1 ratio between exhale and inhale, optimizing:
                                    </p>
                                    <ul>
                                        <li>Vagal tone activation</li>
                                        <li>Heart-rate variability</li>
                                        <li>Parasympathetic nervous system engagement</li>
                                        <li>Natural, effortless breathing rhythm</li>
                                    </ul>
                                </div>

                                <div className="brainwave-card">
                                    <h4>Experience φ in OMNISYNC</h4>
                                    <p>
                                        Explore the Golden Ratio through:
                                    </p>
                                    <ul>
                                        <li><strong>Golden Harmonics Presets</strong> - 12 φ-scaled frequencies including chakra pairings</li>
                                        <li><strong>Fibonacci Ascension Journey</strong> - Frequency progression through φ multiplications</li>
                                        <li><strong>Golden Breath Cycle</strong> - φ-timed breathing with healing frequencies</li>
                                        <li><strong>Chakra Phi Alignment</strong> - Solfeggio frequencies with φ harmonics</li>
                                        <li><strong>Golden Ratio Explorer</strong> - Interactive tool to create custom φ frequencies</li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* Section 4: About the Creators */}
                <div className="expandable-section">
                    <button
                        className={`section-header ${expandedSection === 'creators' ? 'active' : ''}`}
                        onClick={() => toggleSection('creators')}
                    >
                        <h2>About the Creators</h2>
                        {expandedSection === 'creators' ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {expandedSection === 'creators' && (
                        <div className="section-content fade-in">
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
                                <p>
                                    A place where anyone, from beginners to healers, can use frequency, tone, color noise, binaural beats, and soundscapes to support
                                    sleep, focus, stress relief, emotional balance, and spiritual growth.
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
                                <p className="closing">
                                    Whether you're here to meditate, heal, study, rest, connect, or explore: OMNISYNC is our offering to you.
                                    A tool made with love, science, intuition, and the belief that vibration is a universal language.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Privacy Notice */}
                <div className="privacy-notice">
                    <h3>🔒 Your Privacy Matters</h3>
                    <p>
                        All INNERSYNC data (username, journal entries, favorites, and energy profile)
                        is stored locally on your device. We respect your privacy and do not collect,
                        transmit, or store any personal data on external servers. Your sonic healing
                        journey is yours alone.
                    </p>
                </div>
            </div>

            <footer className="page-footer">
                <div>OMNISYNC™</div>
                <div>© NeoTheory Music 2025</div>
            </footer>
        </div>
    );
}
