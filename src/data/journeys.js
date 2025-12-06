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
                { name: 'Heart Opening', duration: 120, freq: 639, bothEars: 8, noiseType: 'pink', desc: 'Emotional alignment and calm' },
                { name: 'Drop into Alpha', duration: 120, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Relaxed, receptive mind' },
                { name: 'Solar Activation', duration: 180, freq: 528, bothEars: 10, noiseType: null, soundscapeType: 'tibetan', desc: 'Transformation + miracle tone' },
                { name: 'Gamma Expansion', duration: 120, freq: 528, bothEars: 40, noiseType: null, desc: 'Peak coherence, visioning' },
                { name: 'Integration', duration: 60, freq: 432, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the manifestation' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Heart Opening', duration: 360, freq: 639, bothEars: 8, noiseType: 'pink', desc: 'Emotional alignment and calm' },
                { name: 'Drop into Alpha', duration: 360, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Relaxed, receptive mind' },
                { name: 'Solar Activation', duration: 480, freq: 528, bothEars: 10, noiseType: null, soundscapeType: 'tibetan', desc: 'Transformation + miracle tone' },
                { name: 'Gamma Expansion', duration: 360, freq: 528, bothEars: 40, noiseType: null, desc: 'Peak coherence, visioning' },
                { name: 'Integration', duration: 240, freq: 432, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the manifestation' }
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
                { name: 'Release', duration: 180, freq: 174, bothEars: 8, noiseType: 'pink', desc: 'Pain & tension reduction' },
                { name: 'Theta Drift', duration: 240, freq: 432, bothEars: 5, noiseType: 'pink', desc: 'Entering dreamstate' },
                { name: 'Delta Drop', duration: 300, freq: 285, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep' },
                { name: 'Subconscious Restore', duration: 120, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Healing mode' },
                { name: 'Dream Shield', duration: 60, freq: 0, bothEars: 0, noiseType: 'brown', soundscapeType: null, desc: 'Protection' }
            ]
        },
        long: {
            duration: 2700, // 45 minutes
            phases: [
                { name: 'Release', duration: 540, freq: 174, bothEars: 8, noiseType: 'pink', desc: 'Pain & tension reduction' },
                { name: 'Theta Drift', duration: 600, freq: 432, bothEars: 5, noiseType: 'pink', desc: 'Entering dreamstate' },
                { name: 'Delta Drop', duration: 900, freq: 285, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep' },
                { name: 'Subconscious Restore', duration: 480, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Healing mode' },
                { name: 'Dream Shield', duration: 180, freq: 0, bothEars: 0, noiseType: 'brown', soundscapeType: null, desc: 'Protection' }
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
                { name: 'Unravel', duration: 120, freq: 417, bothEars: 10, noiseType: null, desc: 'Removing old patterns' },
                { name: 'Clear', duration: 120, freq: 741, bothEars: 10, noiseType: 'violet', desc: 'Detox' },
                { name: 'Rebalance', duration: 180, freq: 528, bothEars: 0, noiseType: 'green', desc: 'Harmony' },
                { name: 'Blessing Tone', duration: 120, freq: 111, bothEars: 0, noiseType: null, desc: 'Angel frequency' },
                { name: 'Rebuild', duration: 60, freq: 528, bothEars: 0, noiseType: null, desc: 'Repair' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Unravel', duration: 360, freq: 417, bothEars: 10, noiseType: null, desc: 'Removing old patterns' },
                { name: 'Clear', duration: 360, freq: 741, bothEars: 10, noiseType: 'violet', desc: 'Detox' },
                { name: 'Rebalance', duration: 540, freq: 528, bothEars: 0, noiseType: 'green', desc: 'Harmony' },
                { name: 'Blessing Tone', duration: 360, freq: 111, bothEars: 0, noiseType: null, desc: 'Angel frequency' },
                { name: 'Rebuild', duration: 180, freq: 528, bothEars: 0, noiseType: null, desc: 'Repair' }
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
                { name: 'Earth Pulse', duration: 180, freq: 7.83, bothEars: 7.83, noiseType: null, soundscapeType: 'earth', desc: 'Schumann resonance' },
                { name: 'Body Gravity', duration: 180, freq: 0, bothEars: 0, noiseType: 'brown', desc: 'Deep grounding' },
                { name: 'Root Chakra Tone', duration: 120, freq: 396, bothEars: 0, noiseType: null, desc: 'Stability' },
                { name: 'Return to Self', duration: 120, freq: 111, bothEars: 0, noiseType: null, desc: 'Centered presence' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Earth Pulse', duration: 540, freq: 7.83, bothEars: 7.83, noiseType: null, soundscapeType: 'earth', desc: 'Schumann resonance' },
                { name: 'Body Gravity', duration: 540, freq: 0, bothEars: 0, noiseType: 'brown', desc: 'Deep grounding' },
                { name: 'Root Chakra Tone', duration: 360, freq: 396, bothEars: 0, noiseType: null, desc: 'Stability' },
                { name: 'Return to Self', duration: 360, freq: 111, bothEars: 0, noiseType: null, desc: 'Centered presence' }
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
                { name: 'Hold', duration: 120, freq: 174, bothEars: 6, noiseType: 'pink', desc: 'Pain soothing' },
                { name: 'Loosen', duration: 120, freq: 417, bothEars: 8, noiseType: null, desc: 'Releasing blocks' },
                { name: 'Break Open', duration: 180, freq: 639, bothEars: 8, noiseType: null, soundscapeType: 'rain', desc: 'Heart opening' },
                { name: 'Let Go', duration: 120, freq: 741, bothEars: 10, noiseType: null, desc: 'Purification' },
                { name: 'Peace', duration: 60, freq: 963, bothEars: 0, noiseType: null, desc: 'Crown clarity' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Hold', duration: 360, freq: 174, bothEars: 6, noiseType: 'pink', desc: 'Pain soothing' },
                { name: 'Loosen', duration: 360, freq: 417, bothEars: 8, noiseType: null, desc: 'Releasing blocks' },
                { name: 'Break Open', duration: 540, freq: 639, bothEars: 8, noiseType: null, soundscapeType: 'rain', desc: 'Heart opening' },
                { name: 'Let Go', duration: 360, freq: 741, bothEars: 10, noiseType: null, desc: 'Purification' },
                { name: 'Peace', duration: 180, freq: 963, bothEars: 0, noiseType: null, desc: 'Crown clarity' }
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
                { name: 'Reset', duration: 120, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Alpha state' },
                { name: 'Engage', duration: 180, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta activation' },
                { name: 'Flow State', duration: 180, freq: 528, bothEars: 18, noiseType: 'pink', desc: 'Peak focus' },
                { name: 'Laser Mode', duration: 120, freq: 528, bothEars: 40, noiseType: null, desc: 'Gamma clarity' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Reset', duration: 360, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Alpha state' },
                { name: 'Engage', duration: 540, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta activation' },
                { name: 'Flow State', duration: 540, freq: 528, bothEars: 18, noiseType: 'pink', desc: 'Peak focus' },
                { name: 'Laser Mode', duration: 360, freq: 528, bothEars: 40, noiseType: null, desc: 'Gamma clarity' }
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
                { name: 'Humming Vibration', duration: 180, freq: 111, bothEars: 4, noiseType: 'brown', desc: 'Stimulating the vagus nerve' },
                { name: 'Parasympathetic Activation', duration: 240, freq: 7.83, bothEars: 0, noiseType: 'pink', desc: 'Deep relaxation response' },
                { name: 'Heart Coherence', duration: 120, freq: 639, bothEars: 0, noiseType: null, desc: 'Balancing heart rate' },
                { name: 'Rest & Digest', duration: 60, freq: 432, bothEars: 0, noiseType: null, desc: 'Settling into calm' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Humming Vibration', duration: 540, freq: 111, bothEars: 4, noiseType: 'brown', desc: 'Stimulating the vagus nerve' },
                { name: 'Parasympathetic Activation', duration: 720, freq: 7.83, bothEars: 0, noiseType: 'pink', desc: 'Deep relaxation response' },
                { name: 'Heart Coherence', duration: 360, freq: 639, bothEars: 0, noiseType: null, desc: 'Balancing heart rate' },
                { name: 'Rest & Digest', duration: 180, freq: 432, bothEars: 0, noiseType: null, desc: 'Settling into calm' }
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
                { name: 'Alpha Relax', duration: 180, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Clearing the mind' },
                { name: 'Theta Dream', duration: 180, freq: 528, bothEars: 6, noiseType: 'pink', desc: 'Accessing subconscious' },
                { name: 'Gamma Spark', duration: 180, freq: 528, bothEars: 40, noiseType: null, desc: 'Insight flash' },
                { name: 'Flow Integration', duration: 60, freq: 432, bothEars: 14, noiseType: null, desc: 'Grounding the idea' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Alpha Relax', duration: 540, freq: 432, bothEars: 10, noiseType: 'green', desc: 'Clearing the mind' },
                { name: 'Theta Dream', duration: 540, freq: 528, bothEars: 6, noiseType: 'pink', desc: 'Accessing subconscious' },
                { name: 'Gamma Spark', duration: 540, freq: 528, bothEars: 40, noiseType: null, desc: 'Insight flash' },
                { name: 'Flow Integration', duration: 180, freq: 432, bothEars: 14, noiseType: null, desc: 'Grounding the idea' }
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
                { name: 'Signal Dampening', duration: 300, freq: 174, bothEars: 4, noiseType: 'pink', desc: 'Reducing pain perception' },
                { name: 'Deep Release', duration: 300, freq: 111, bothEars: 2, noiseType: 'brown', desc: 'Cellular relaxation' },
                { name: 'Delta Recovery', duration: 240, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Tissue repair mode' },
                { name: 'Gentle Return', duration: 60, freq: 174, bothEars: 0, noiseType: null, desc: 'Waking up softly' }
            ]
        },
        long: {
            duration: 2700, // 45 minutes
            phases: [
                { name: 'Signal Dampening', duration: 900, freq: 174, bothEars: 4, noiseType: 'pink', desc: 'Reducing pain perception' },
                { name: 'Deep Release', duration: 900, freq: 111, bothEars: 2, noiseType: 'brown', desc: 'Cellular relaxation' },
                { name: 'Delta Recovery', duration: 600, freq: 285, bothEars: 1, noiseType: 'brown', desc: 'Tissue repair mode' },
                { name: 'Gentle Return', duration: 300, freq: 174, bothEars: 0, noiseType: null, desc: 'Waking up softly' }
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
                { name: 'Gentle Awakening', duration: 120, freq: 432, bothEars: 10, noiseType: 'pink', desc: 'Alpha transition' },
                { name: 'Mental Clarity', duration: 180, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta focus' },
                { name: 'Energy Boost', duration: 180, freq: 528, bothEars: 20, noiseType: null, desc: 'High Beta power' },
                { name: 'Peak State', duration: 120, freq: 963, bothEars: 40, noiseType: null, desc: 'Gamma brilliance' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Gentle Awakening', duration: 360, freq: 432, bothEars: 10, noiseType: 'pink', desc: 'Alpha transition' },
                { name: 'Mental Clarity', duration: 540, freq: 528, bothEars: 14, noiseType: null, desc: 'Beta focus' },
                { name: 'Energy Boost', duration: 540, freq: 528, bothEars: 20, noiseType: null, desc: 'High Beta power' },
                { name: 'Peak State', duration: 360, freq: 963, bothEars: 40, noiseType: null, desc: 'Gamma brilliance' }
            ]
        }
    },
    {
        id: 'sonic-rebirth',
        title: 'Sonic Rebirth Journey',
        icon: 'Waves',
        description: 'Water-element transformation for identity renewal and emotional clarity',
        category: 'transformation',
        short: {
            duration: 720, // 12 minutes
            phases: [
                { name: 'Dissolving the Old', duration: 144, freq: 174, bothEars: 2, noiseType: 'pink', soundscapeType: 'ocean', desc: 'Release past stress and identities' },
                { name: 'The Void Pool', duration: 144, freq: 432, bothEars: 5.5, noiseType: null, soundscapeType: 'ocean', desc: 'Timeless neutrality' },
                { name: 'Returning Light', duration: 144, freq: 528, bothEars: 7, noiseType: null, desc: 'Clarity and re-alignment' },
                { name: 'Rebirth', duration: 144, freq: 639, bothEars: 10, noiseType: null, desc: 'Emergence and awakening' },
                { name: 'Integration', duration: 144, freq: 396, bothEars: 4, noiseType: 'pink', soundscapeType: 'rain', desc: 'Grounding the new self' }
            ]
        },
        long: {
            duration: 2100, // 35 minutes
            phases: [
                { name: 'Dissolving the Old', duration: 420, freq: 174, bothEars: 2, noiseType: 'pink', soundscapeType: 'ocean', desc: 'Release past stress and identities' },
                { name: 'The Void Pool', duration: 420, freq: 432, bothEars: 5.5, noiseType: null, soundscapeType: 'ocean', desc: 'Timeless neutrality' },
                { name: 'Returning Light', duration: 420, freq: 528, bothEars: 7, noiseType: null, desc: 'Clarity and re-alignment' },
                { name: 'Rebirth', duration: 420, freq: 639, bothEars: 10, noiseType: null, desc: 'Emergence and awakening' },
                { name: 'Integration', duration: 420, freq: 396, bothEars: 4, noiseType: 'pink', soundscapeType: 'rain', desc: 'Grounding the new self' }
            ]
        }
    },
    {
        id: 'astral-travel-dream',
        title: 'Astral Travel Dream Journey',
        icon: 'Star',
        description: 'Lucid dream induction and astral exploration experience',
        category: 'consciousness',
        short: {
            duration: 1080, // 18 minutes
            phases: [
                { name: 'Veil Softening', duration: 180, freq: 432, bothEars: 6, noiseType: 'pink', desc: 'Theta induction' },
                { name: 'Silver Cord Activation', duration: 240, freq: 528, bothEars: 4.5, noiseType: null, desc: 'Inner body expansion' },
                { name: 'Etheric Lift-Off', duration: 240, freq: 963, bothEars: 2.5, noiseType: null, desc: 'Separation shift' },
                { name: 'Stargate Drift', duration: 300, freq: 432, bothEars: 4, noiseType: null, soundscapeType: 'wind', desc: 'Lucid exploration', loopable: true },
                { name: 'Drift Return', duration: 120, freq: 396, bothEars: 6, noiseType: 'pink', desc: 'Soft re-embodiment' }
            ]
        },
        long: {
            duration: 1920, // 32 minutes
            phases: [
                { name: 'Veil Softening', duration: 300, freq: 432, bothEars: 6, noiseType: 'pink', desc: 'Theta induction' },
                { name: 'Silver Cord Activation', duration: 360, freq: 528, bothEars: 4.5, noiseType: null, desc: 'Inner body expansion' },
                { name: 'Etheric Lift-Off', duration: 300, freq: 963, bothEars: 2.5, noiseType: null, desc: 'Separation shift' },
                { name: 'Stargate Drift', duration: 600, freq: 432, bothEars: 4, noiseType: null, soundscapeType: 'wind', desc: 'Lucid exploration', loopable: true },
                { name: 'Drift Return', duration: 360, freq: 396, bothEars: 6, noiseType: 'pink', desc: 'Soft re-embodiment' }
            ]
        }
    }
];
