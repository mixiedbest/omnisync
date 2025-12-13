// Curated multi-phase sound healing journeys
export const journeys = [
    {
        id: 'manifestation-gateway',
        title: 'Manifestation Gateway',
        icon: 'Sparkles',
        description: 'Align intention, emotion, and subconscious to manifest desires',
        category: 'manifestation',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Heart Opening', duration: 120, freq: 639, bothEars: 8, noiseType: 'pink', desc: 'Emotional alignment and calm', breathingPattern: 'coherent' },
                { name: 'Drop into Alpha', duration: 120, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Relaxed, receptive mind', breathingPattern: '478' },
                { name: 'Solar Activation', duration: 180, freq: 528, bothEars: 10, noiseType: null, soundscapeType: 'tibetan', desc: 'Transformation + miracle tone', breathingPattern: 'box' },
                { name: 'Gamma Expansion', duration: 120, freq: 528, bothEars: 40, noiseType: null, desc: 'Peak coherence, visioning', breathingPattern: 'energizing' },
                { name: 'Integration', duration: 60, freq: 432, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the manifestation', breathingPattern: 'coherent' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Heart Opening', duration: 360, freq: 639, bothEars: 8, noiseType: 'pink', desc: 'Emotional alignment and calm', breathingPattern: 'coherent' },
                { name: 'Drop into Alpha', duration: 360, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Relaxed, receptive mind', breathingPattern: '478' },
                { name: 'Solar Activation', duration: 480, freq: 528, bothEars: 10, noiseType: null, soundscapeType: 'tibetan', desc: 'Transformation + miracle tone', breathingPattern: 'box' },
                { name: 'Gamma Expansion', duration: 360, freq: 528, bothEars: 40, noiseType: null, desc: 'Peak coherence, visioning', breathingPattern: 'energizing' },
                { name: 'Integration', duration: 240, freq: 432, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the manifestation', breathingPattern: 'coherent' }
            ]
        }
    },
    {
        id: 'deep-sleep-descent',
        title: 'Deep Sleep Descent',
        icon: 'Moon',
        description: 'Fall asleep faster, stay asleep, stop overthinking',
        category: 'sleep',
        short: {
            duration: 900, // 15 minutes
            phases: [
                { name: 'Release', duration: 180, freq: 174, bothEars: 8, noiseType: 'pink', desc: 'Pain & tension reduction', breathingPattern: '478' },
                { name: 'Theta Drift', duration: 240, freq: 432, bothEars: 5, noiseType: 'pink', desc: 'Entering dreamstate', breathingPattern: '478' },
                { name: 'Delta Drop', duration: 300, freq: 285, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep', breathingPattern: '478' },
                { name: 'Subconscious Restore', duration: 120, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Healing mode', breathingPattern: 'coherent' },
                {
                    name: 'Dream Shield',
                    duration: 60,
                    freq: 0,
                    bothEars: 0,
                    noiseType: 'brown',
                    soundscapeType: null,
                    desc: 'Protection',
                    breathingPattern: 'coherent',
                    customizable: true,
                    durationOptions: [300, 600, 1200, 1800, 3600] // 5, 10, 20, 30, 60 min
                }
            ]
        },
        long: {
            duration: 2700, // 45 minutes
            phases: [
                { name: 'Release', duration: 540, freq: 174, bothEars: 8, noiseType: 'pink', desc: 'Pain & tension reduction', breathingPattern: '478' },
                { name: 'Theta Drift', duration: 600, freq: 432, bothEars: 5, noiseType: 'pink', desc: 'Entering dreamstate', breathingPattern: '478' },
                { name: 'Delta Drop', duration: 900, freq: 285, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep', breathingPattern: '478' },
                { name: 'Subconscious Restore', duration: 480, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Healing mode', breathingPattern: 'coherent' },
                {
                    name: 'Dream Shield',
                    duration: 180,
                    freq: 0,
                    bothEars: 0,
                    noiseType: 'brown',
                    soundscapeType: null,
                    desc: 'Protection',
                    breathingPattern: 'coherent',
                    customizable: true,
                    durationOptions: [1800, 3600, 7200, 10800, 14400, 21600] // 30m, 1h, 2h, 3h, 4h, 6h
                }
            ]
        }
    },
    {
        id: 'magnetic-aura-cleanse',
        title: 'Magnetic Aura Cleanse',
        icon: 'Star',
        description: 'Clear emotional buildup, negative thoughts, and energetic heaviness',
        category: 'cleansing',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Unravel', duration: 120, freq: 417, bothEars: 10, noiseType: null, desc: 'Removing old patterns', breathingPattern: 'box' },
                { name: 'Clear', duration: 120, freq: 741, bothEars: 10, noiseType: 'violet', desc: 'Detox', breathingPattern: 'box' },
                { name: 'Rebalance', duration: 180, freq: 528, bothEars: 0, noiseType: 'green', desc: 'Harmony', breathingPattern: 'box' },
                { name: 'Blessing Tone', duration: 120, freq: 111, bothEars: 0, noiseType: null, desc: 'Angel frequency', breathingPattern: 'box' },
                { name: 'Rebuild', duration: 60, freq: 528, bothEars: 0, noiseType: null, desc: 'Repair', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Unravel', duration: 360, freq: 417, bothEars: 10, noiseType: null, desc: 'Removing old patterns', breathingPattern: 'box' },
                { name: 'Clear', duration: 360, freq: 741, bothEars: 10, noiseType: 'violet', desc: 'Detox', breathingPattern: 'box' },
                { name: 'Rebalance', duration: 540, freq: 528, bothEars: 0, noiseType: 'green', desc: 'Harmony', breathingPattern: 'box' },
                { name: 'Blessing Tone', duration: 360, freq: 111, bothEars: 0, noiseType: null, desc: 'Angel frequency', breathingPattern: 'box' },
                { name: 'Rebuild', duration: 180, freq: 528, bothEars: 0, noiseType: null, desc: 'Repair', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'rooted-unshakeable',
        title: 'Rooted & Unshakeable',
        icon: 'TreeDeciduous',
        description: 'For anxiety, overthinking, overstimulation, EMF stress',
        category: 'grounding',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Earth Pulse', duration: 180, freq: 7.83, bothEars: 7.83, noiseType: null, soundscapeType: 'earth', desc: 'Schumann resonance', breathingPattern: 'box' },
                { name: 'Body Gravity', duration: 180, freq: 0, bothEars: 0, noiseType: 'brown', desc: 'Deep grounding', breathingPattern: 'box' },
                { name: 'Root Chakra Tone', duration: 120, freq: 396, bothEars: 0, noiseType: null, desc: 'Stability', breathingPattern: 'box' },
                { name: 'Return to Self', duration: 120, freq: 111, bothEars: 0, noiseType: null, desc: 'Centered presence', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Earth Pulse', duration: 540, freq: 7.83, bothEars: 7.83, noiseType: null, soundscapeType: 'earth', desc: 'Schumann resonance', breathingPattern: 'box' },
                { name: 'Body Gravity', duration: 540, freq: 0, bothEars: 0, noiseType: 'brown', desc: 'Deep grounding', breathingPattern: 'box' },
                { name: 'Root Chakra Tone', duration: 360, freq: 396, bothEars: 0, noiseType: null, desc: 'Stability', breathingPattern: 'box' },
                { name: 'Return to Self', duration: 360, freq: 111, bothEars: 0, noiseType: null, desc: 'Centered presence', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'emotional-release-ritual',
        title: 'Emotional Release Ritual',
        icon: 'Droplets',
        description: 'Let emotions flow without suppressing',
        category: 'healing',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Hold', duration: 120, freq: 174, bothEars: 6, noiseType: 'pink', desc: 'Pain soothing', breathingPattern: 'box' },
                { name: 'Loosen', duration: 120, freq: 417, bothEars: 8, noiseType: null, desc: 'Releasing blocks', breathingPattern: 'box' },
                { name: 'Break Open', duration: 180, freq: 639, bothEars: 8, noiseType: null, soundscapeType: 'rain', desc: 'Heart opening', breathingPattern: 'box' },
                { name: 'Let Go', duration: 120, freq: 741, bothEars: 10, noiseType: null, desc: 'Purification', breathingPattern: 'box' },
                { name: 'Peace', duration: 60, freq: 963, bothEars: 0, noiseType: null, desc: 'Crown clarity', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Hold', duration: 360, freq: 174, bothEars: 6, noiseType: 'pink', desc: 'Pain soothing', breathingPattern: 'box' },
                { name: 'Loosen', duration: 360, freq: 417, bothEars: 8, noiseType: null, desc: 'Releasing blocks', breathingPattern: 'box' },
                { name: 'Break Open', duration: 540, freq: 639, bothEars: 8, noiseType: null, soundscapeType: 'rain', desc: 'Heart opening', breathingPattern: 'box' },
                { name: 'Let Go', duration: 360, freq: 741, bothEars: 10, noiseType: null, desc: 'Purification', breathingPattern: 'box' },
                { name: 'Peace', duration: 180, freq: 963, bothEars: 0, noiseType: null, desc: 'Crown clarity', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'focus-flow-accelerator',
        title: 'Focus Flow Accelerator',
        icon: 'Target',
        description: 'Get into a productive, clear mental zone',
        category: 'focus',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Reset', duration: 120, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Alpha state', breathingPattern: 'box' },
                { name: 'Engage', duration: 180, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta activation', breathingPattern: 'box' },
                { name: 'Flow State', duration: 180, freq: 528, bothEars: 18, noiseType: 'pink', desc: 'Peak focus', breathingPattern: 'box' },
                { name: 'Laser Mode', duration: 120, freq: 528, bothEars: 40, noiseType: null, desc: 'Gamma clarity', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Reset', duration: 360, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Alpha state', breathingPattern: 'box' },
                { name: 'Engage', duration: 540, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta activation', breathingPattern: 'box' },
                { name: 'Flow State', duration: 540, freq: 528, bothEars: 18, noiseType: 'pink', desc: 'Peak focus', breathingPattern: 'box' },
                { name: 'Laser Mode', duration: 360, freq: 528, bothEars: 40, noiseType: null, desc: 'Gamma clarity', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'vagus-nerve-reset',
        title: 'Vagus Nerve Reset',
        icon: 'Waves',
        description: 'Calm the nervous system with low-frequency vibration',
        category: 'healing',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Humming Vibration', duration: 180, freq: 111, bothEars: 4, noiseType: 'brown', desc: 'Stimulating the vagus nerve', breathingPattern: 'box' },
                { name: 'Parasympathetic Activation', duration: 240, freq: 7.83, bothEars: 0, noiseType: 'pink', desc: 'Deep relaxation response', breathingPattern: 'box' },
                { name: 'Heart Coherence', duration: 120, freq: 639, bothEars: 0, noiseType: null, desc: 'Balancing heart rate', breathingPattern: 'box' },
                { name: 'Rest & Digest', duration: 60, freq: 432, bothEars: 0, noiseType: null, desc: 'Settling into calm', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Humming Vibration', duration: 540, freq: 111, bothEars: 4, noiseType: 'brown', desc: 'Stimulating the vagus nerve', breathingPattern: 'box' },
                { name: 'Parasympathetic Activation', duration: 720, freq: 7.83, bothEars: 0, noiseType: 'pink', desc: 'Deep relaxation response', breathingPattern: 'box' },
                { name: 'Heart Coherence', duration: 360, freq: 639, bothEars: 0, noiseType: null, desc: 'Balancing heart rate', breathingPattern: 'box' },
                { name: 'Rest & Digest', duration: 180, freq: 432, bothEars: 0, noiseType: null, desc: 'Settling into calm', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'creative-breakthrough',
        title: 'Creative Breakthrough',
        icon: 'Lightbulb',
        description: 'Spark insight and "aha!" moments',
        category: 'focus',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Alpha Relax', duration: 180, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Clearing the mind', breathingPattern: 'box' },
                { name: 'Theta Dream', duration: 180, freq: 528, bothEars: 6, noiseType: 'pink', desc: 'Accessing subconscious', breathingPattern: 'box' },
                { name: 'Gamma Spark', duration: 180, freq: 528, bothEars: 40, noiseType: null, desc: 'Insight flash', breathingPattern: 'box' },
                { name: 'Flow Integration', duration: 60, freq: 432, bothEars: 14, noiseType: null, desc: 'Grounding the idea', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Alpha Relax', duration: 540, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Clearing the mind', breathingPattern: 'box' },
                { name: 'Theta Dream', duration: 540, freq: 528, bothEars: 6, noiseType: 'pink', desc: 'Accessing subconscious', breathingPattern: 'box' },
                { name: 'Gamma Spark', duration: 540, freq: 528, bothEars: 40, noiseType: null, desc: 'Insight flash', breathingPattern: 'box' },
                { name: 'Flow Integration', duration: 180, freq: 432, bothEars: 14, noiseType: null, desc: 'Grounding the idea', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'pain-relief-protocol',
        title: 'Pain Relief Protocol',
        icon: 'Activity',
        description: 'Deep physical relaxation and pain signal reduction',
        category: 'healing',
        short: {
            duration: 900, // 15 minutes
            phases: [
                { name: 'Signal Dampening', duration: 300, freq: 174, bothEars: 4, noiseType: 'pink', desc: 'Reducing pain perception', breathingPattern: 'box' },
                { name: 'Deep Release', duration: 300, freq: 111, bothEars: 2, noiseType: 'brown', desc: 'Cellular relaxation', breathingPattern: 'box' },
                { name: 'Delta Recovery', duration: 240, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Tissue repair mode', breathingPattern: 'box' },
                { name: 'Gentle Return', duration: 60, freq: 174, bothEars: 0, noiseType: null, desc: 'Waking up softly', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 2700, // 45 minutes
            phases: [
                { name: 'Signal Dampening', duration: 900, freq: 174, bothEars: 4, noiseType: 'pink', desc: 'Reducing pain perception', breathingPattern: 'box' },
                { name: 'Deep Release', duration: 900, freq: 111, bothEars: 2, noiseType: 'brown', desc: 'Cellular relaxation', breathingPattern: 'box' },
                { name: 'Delta Recovery', duration: 600, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Tissue repair mode', breathingPattern: 'box' },
                { name: 'Gentle Return', duration: 300, freq: 174, bothEars: 0, noiseType: null, desc: 'Waking up softly', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'morning-glory',
        title: 'Morning Glory',
        icon: 'Sun',
        description: 'Wake up with energy and positivity (caffeine-free)',
        category: 'energy',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Gentle Awakening', duration: 120, freq: 432, bothEars: 10, noiseType: 'pink', desc: 'Alpha transition', breathingPattern: 'box' },
                { name: 'Mental Clarity', duration: 180, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta focus', breathingPattern: 'box' },
                { name: 'Energy Boost', duration: 180, freq: 528, bothEars: 20, noiseType: null, desc: 'High Beta power', breathingPattern: 'box' },
                { name: 'Peak State', duration: 120, freq: 963, bothEars: 40, noiseType: null, desc: 'Gamma brilliance', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Gentle Awakening', duration: 360, freq: 432, bothEars: 10, noiseType: 'pink', desc: 'Alpha transition', breathingPattern: 'box' },
                { name: 'Mental Clarity', duration: 540, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta focus', breathingPattern: 'box' },
                { name: 'Energy Boost', duration: 540, freq: 528, bothEars: 20, noiseType: null, desc: 'High Beta power', breathingPattern: 'box' },
                { name: 'Peak State', duration: 360, freq: 963, bothEars: 40, noiseType: null, desc: 'Gamma brilliance', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'sonic-rebirth',
        title: 'Sonic Rebirth',
        icon: 'Waves',
        description: 'Water-element transformation for identity renewal and emotional clarity',
        category: 'transformation',
        short: {
            duration: 720, // 12 minutes
            phases: [
                { name: 'Dissolving the Old', duration: 144, freq: 174, bothEars: 2, noiseType: 'pink', soundscapeType: 'ocean', desc: 'Release past stress and identities', breathingPattern: 'box' },
                { name: 'The Void Pool', duration: 144, freq: 432, bothEars: 5.5, noiseType: null, soundscapeType: 'ocean', desc: 'Timeless neutrality', breathingPattern: 'box' },
                { name: 'Returning Light', duration: 144, freq: 528, bothEars: 7, noiseType: null, desc: 'Clarity and re-alignment', breathingPattern: 'box' },
                { name: 'Rebirth', duration: 144, freq: 639, bothEars: 10, noiseType: null, desc: 'Emergence and awakening', breathingPattern: 'box' },
                { name: 'Integration', duration: 144, freq: 396, bothEars: 4, noiseType: 'pink', soundscapeType: 'rain', desc: 'Grounding the new self', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 2100, // 35 minutes
            phases: [
                { name: 'Dissolving the Old', duration: 420, freq: 174, bothEars: 2, noiseType: 'pink', soundscapeType: 'ocean', desc: 'Release past stress and identities', breathingPattern: 'box' },
                { name: 'The Void Pool', duration: 420, freq: 432, bothEars: 5.5, noiseType: null, soundscapeType: 'ocean', desc: 'Timeless neutrality', breathingPattern: 'box' },
                { name: 'Returning Light', duration: 420, freq: 528, bothEars: 7, noiseType: null, desc: 'Clarity and re-alignment', breathingPattern: 'box' },
                { name: 'Rebirth', duration: 420, freq: 639, bothEars: 10, noiseType: null, desc: 'Emergence and awakening', breathingPattern: 'box' },
                { name: 'Integration', duration: 420, freq: 396, bothEars: 4, noiseType: 'pink', soundscapeType: 'rain', desc: 'Grounding the new self', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'astral-travel-dream',
        title: 'Astral Travel Dream',
        icon: 'Star',
        description: 'Lucid dream induction and astral exploration experience',
        category: 'consciousness',
        short: {
            duration: 1080, // 18 minutes
            phases: [
                { name: 'Veil Softening', duration: 180, freq: 432, bothEars: 6, noiseType: 'pink', desc: 'Theta induction', breathingPattern: 'box' },
                { name: 'Silver Cord Activation', duration: 240, freq: 528, bothEars: 4.5, noiseType: null, desc: 'Inner body expansion', breathingPattern: 'box' },
                { name: 'Etheric Lift-Off', duration: 240, freq: 963, bothEars: 2.5, noiseType: null, desc: 'Separation shift', breathingPattern: 'box' },
                {
                    name: 'Stargate Drift',
                    duration: 300,
                    freq: 432,
                    bothEars: 4,
                    noiseType: null,
                    soundscapeType: 'wind',
                    desc: 'Lucid exploration',
                    customizable: true,
                    durationOptions: [300, 600, 1200, 1800, 3600] // 5, 10, 20, 30, 60 min
                },
                { name: 'Drift Return', duration: 120, freq: 396, bothEars: 6, noiseType: 'pink', desc: 'Soft re-embodiment', breathingPattern: 'box' }
            ]
        },
        long: {
            duration: 1920, // 32 minutes
            phases: [
                { name: 'Veil Softening', duration: 300, freq: 432, bothEars: 6, noiseType: 'pink', desc: 'Theta induction', breathingPattern: 'box' },
                { name: 'Silver Cord Activation', duration: 360, freq: 528, bothEars: 4.5, noiseType: null, desc: 'Inner body expansion', breathingPattern: 'box' },
                { name: 'Etheric Lift-Off', duration: 300, freq: 963, bothEars: 2.5, noiseType: null, desc: 'Separation shift', breathingPattern: 'box' },
                {
                    name: 'Stargate Drift',
                    duration: 3600,
                    freq: 432,
                    bothEars: 4,
                    noiseType: null,
                    soundscapeType: 'wind',
                    desc: 'Lucid exploration',
                    customizable: true,
                    durationOptions: [1800, 3600, 7200, 10800, 14400, 21600] // 30m, 1h, 2h, 3h, 4h, 6h
                },
                { name: 'Drift Return', duration: 360, freq: 396, bothEars: 6, noiseType: 'pink', desc: 'Soft re-embodiment', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'fibonacci-ascension',
        title: 'Fibonacci Ascension',
        icon: 'TrendingUp',
        description: 'Ascend through φ-scaled frequencies from grounding to higher awareness',
        category: 'golden-ratio',
        short: {
            duration: 900, // 15 minutes
            phases: [
                {
                    name: 'Grounding Descent',
                    duration: 180,
                    freq: 267,
                    bothEars: 0,
                    noiseType: 'brown',
                    desc: '432 ÷ φ - Deep nervous system calm',
                    breathingPattern: '478'
                },
                {
                    name: 'Phi Root Foundation',
                    duration: 240,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    desc: 'Pure 432 Hz - The golden foundation',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Heart Coherence Rise',
                    duration: 240,
                    freq: 699,
                    bothEars: 0,
                    noiseType: null,
                    desc: '432 × φ - Emotional balance',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Higher Awareness Peak',
                    duration: 180,
                    freq: 1131,
                    bothEars: 0,
                    noiseType: null,
                    desc: '699 × φ - Intuition and clarity',
                    breathingPattern: 'box'
                },
                {
                    name: 'Integration',
                    duration: 60,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    soundscapeType: 'tibetan',
                    desc: 'Return to center',
                    breathingPattern: 'coherent'
                }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                {
                    name: 'Grounding Descent',
                    duration: 360,
                    freq: 267,
                    bothEars: 0,
                    noiseType: 'brown',
                    desc: '432 ÷ φ - Deep nervous system calm',
                    breathingPattern: '478'
                },
                {
                    name: 'Phi Root Foundation',
                    duration: 480,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    desc: 'Pure 432 Hz - The golden foundation',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Heart Coherence Rise',
                    duration: 480,
                    freq: 699,
                    bothEars: 0,
                    noiseType: null,
                    desc: '432 × φ - Emotional balance',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Higher Awareness Peak',
                    duration: 360,
                    freq: 1131,
                    bothEars: 0,
                    noiseType: null,
                    desc: '699 × φ - Intuition and clarity',
                    breathingPattern: 'box'
                },
                {
                    name: 'Integration',
                    duration: 120,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    soundscapeType: 'tibetan',
                    desc: 'Return to center',
                    breathingPattern: 'coherent'
                }
            ]
        }
    },
    {
        id: 'golden-breath-cycle',
        title: 'Golden Breath Cycle',
        icon: 'Wind',
        description: 'Guided breathing with φ-timed inhale/exhale for natural coherence',
        category: 'golden-ratio',
        short: {
            duration: 600, // 10 minutes
            phases: [
                {
                    name: 'Breath Awareness',
                    duration: 120,
                    freq: 432,
                    bothEars: 8,
                    noiseType: 'pink',
                    desc: 'Natural breath observation',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Golden Ratio Breathing',
                    duration: 360,
                    freq: 528,
                    bothEars: 0,
                    noiseType: null,
                    desc: '4s inhale / 6.5s exhale (φ ratio)',
                    breathingPattern: 'golden',
                    breathingGuide: {
                        inhale: 4,
                        hold: 0,
                        exhale: 6.5,
                        pause: 0
                    }
                },
                {
                    name: 'Vagal Tone Activation',
                    duration: 60,
                    freq: 639,
                    bothEars: 0,
                    noiseType: null,
                    desc: 'Heart-rate variability optimization',
                    breathingPattern: 'golden',
                    breathingGuide: {
                        inhale: 4,
                        hold: 0,
                        exhale: 6.5,
                        pause: 0
                    }
                },
                {
                    name: 'Integration',
                    duration: 60,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    soundscapeType: 'wind',
                    desc: 'Return to natural rhythm',
                    breathingPattern: 'coherent'
                }
            ]
        },
        long: {
            duration: 1200, // 20 minutes
            phases: [
                {
                    name: 'Breath Awareness',
                    duration: 240,
                    freq: 432,
                    bothEars: 8,
                    noiseType: 'pink',
                    desc: 'Natural breath observation',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Golden Ratio Breathing',
                    duration: 720,
                    freq: 528,
                    bothEars: 0,
                    noiseType: null,
                    desc: '4s inhale / 6.5s exhale (φ ratio)',
                    breathingPattern: 'golden',
                    breathingGuide: {
                        inhale: 4,
                        hold: 0,
                        exhale: 6.5,
                        pause: 0
                    }
                },
                {
                    name: 'Vagal Tone Activation',
                    duration: 120,
                    freq: 639,
                    bothEars: 0,
                    noiseType: null,
                    desc: 'Heart-rate variability optimization',
                    breathingPattern: 'golden',
                    breathingGuide: {
                        inhale: 4,
                        hold: 0,
                        exhale: 6.5,
                        pause: 0
                    }
                },
                {
                    name: 'Integration',
                    duration: 120,
                    freq: 432,
                    bothEars: 0,
                    noiseType: null,
                    soundscapeType: 'wind',
                    desc: 'Return to natural rhythm',
                    breathingPattern: 'coherent'
                }
            ]
        }
    },
    {
        id: 'chakra-phi-alignment',
        title: 'Chakra Phi Alignment',
        icon: 'Hexagon',
        description: 'Journey through all 7 chakras with φ-expanded harmonics',
        category: 'golden-ratio',
        short: {
            duration: 840, // 14 minutes (2 min per chakra)
            phases: [
                {
                    name: 'Root Phi Alignment',
                    duration: 120,
                    freq: 396,
                    bothEars: 0,
                    phiHarmonic: 641,
                    noiseType: null,
                    desc: 'Root (396 Hz) + φ expansion (641 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Sacral Phi Alignment',
                    duration: 120,
                    freq: 417,
                    bothEars: 0,
                    phiHarmonic: 675,
                    noiseType: null,
                    desc: 'Sacral (417 Hz) + φ expansion (675 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Solar Phi Alignment',
                    duration: 120,
                    freq: 528,
                    bothEars: 0,
                    phiHarmonic: 854,
                    noiseType: null,
                    desc: 'Solar (528 Hz) + φ expansion (854 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Heart Phi Alignment',
                    duration: 120,
                    freq: 639,
                    bothEars: 0,
                    phiHarmonic: 1034,
                    noiseType: null,
                    desc: 'Heart (639 Hz) + φ expansion (1034 Hz)',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Throat Phi Alignment',
                    duration: 120,
                    freq: 741,
                    bothEars: 0,
                    phiHarmonic: 1199,
                    noiseType: null,
                    desc: 'Throat (741 Hz) + φ expansion (1199 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Third Eye Phi Alignment',
                    duration: 120,
                    freq: 852,
                    bothEars: 0,
                    phiHarmonic: 1379,
                    noiseType: null,
                    desc: 'Third Eye (852 Hz) + φ expansion (1379 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Crown Phi Alignment',
                    duration: 120,
                    freq: 963,
                    bothEars: 0,
                    phiHarmonic: 1558,
                    noiseType: null,
                    soundscapeType: 'tibetan',
                    desc: 'Crown (963 Hz) + φ expansion (1558 Hz)',
                    breathingPattern: 'coherent'
                }
            ]
        },
        long: {
            duration: 2100, // 35 minutes (5 min per chakra)
            phases: [
                {
                    name: 'Root Phi Alignment',
                    duration: 300,
                    freq: 396,
                    bothEars: 0,
                    phiHarmonic: 641,
                    noiseType: null,
                    desc: 'Root (396 Hz) + φ expansion (641 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Sacral Phi Alignment',
                    duration: 300,
                    freq: 417,
                    bothEars: 0,
                    phiHarmonic: 675,
                    noiseType: null,
                    desc: 'Sacral (417 Hz) + φ expansion (675 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Solar Phi Alignment',
                    duration: 300,
                    freq: 528,
                    bothEars: 0,
                    phiHarmonic: 854,
                    noiseType: null,
                    desc: 'Solar (528 Hz) + φ expansion (854 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Heart Phi Alignment',
                    duration: 300,
                    freq: 639,
                    bothEars: 0,
                    phiHarmonic: 1034,
                    noiseType: null,
                    desc: 'Heart (639 Hz) + φ expansion (1034 Hz)',
                    breathingPattern: 'coherent'
                },
                {
                    name: 'Throat Phi Alignment',
                    duration: 300,
                    freq: 741,
                    bothEars: 0,
                    phiHarmonic: 1199,
                    noiseType: null,
                    desc: 'Throat (741 Hz) + φ expansion (1199 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Third Eye Phi Alignment',
                    duration: 300,
                    freq: 852,
                    bothEars: 0,
                    phiHarmonic: 1379,
                    noiseType: null,
                    desc: 'Third Eye (852 Hz) + φ expansion (1379 Hz)',
                    breathingPattern: 'box'
                },
                {
                    name: 'Crown Phi Alignment',
                    duration: 300,
                    freq: 963,
                    bothEars: 0,
                    phiHarmonic: 1558,
                    noiseType: null,
                    soundscapeType: 'tibetan',
                    desc: 'Crown (963 Hz) + φ expansion (1558 Hz)',
                    breathingPattern: 'coherent'
                }
            ]
        }
    }
];
