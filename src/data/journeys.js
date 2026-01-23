// Curated multi-phase sound healing journeys
// Updated with accurate Nogier, Planetary, and Brainwave frequencies

export const journeys = [
    {
        id: 'manifestation-gateway',
        title: 'Manifestation Gateway',
        icon: 'Sparkles',
        description: 'Align intention with Jupiter abundance and Solar power frequencies',
        category: 'manifestation',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Heart Coherence', duration: 120, freq: 136.1, bothEars: 5, noiseType: 'pink', desc: 'Earth Year (Om) for centering', breathingPattern: 'coherent' },
                { name: 'Solar Activation', duration: 180, freq: 126.22, bothEars: 8, noiseType: null, soundscapeType: 'tibetan', desc: 'Sun Frequency for will/ego power', breathingPattern: 'box' },
                { name: 'Jupiter Abundance', duration: 180, freq: 183.58, bothEars: 12, noiseType: null, desc: 'Jupiter Frequency for luck & expansion', breathingPattern: 'energizing' },
                { name: 'Gamma Visioning', duration: 60, freq: 432, bothEars: 40, noiseType: null, desc: 'High-level processing & realization', breathingPattern: 'energizing' },
                { name: 'Integration', duration: 60, freq: 136.1, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the signal', breathingPattern: 'coherent' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Heart Coherence', duration: 300, freq: 136.1, bothEars: 5, noiseType: 'pink', desc: 'Earth Year (Om) for centering', breathingPattern: 'coherent' },
                { name: 'Solar Activation', duration: 420, freq: 126.22, bothEars: 8, noiseType: null, soundscapeType: 'tibetan', desc: 'Sun Frequency for will/ego power', breathingPattern: 'box' },
                { name: 'Jupiter Abundance', duration: 600, freq: 183.58, bothEars: 12, noiseType: null, desc: 'Jupiter Frequency for luck & expansion', breathingPattern: 'energizing' },
                { name: 'Gamma Visioning', duration: 300, freq: 432, bothEars: 40, noiseType: null, desc: 'High-level processing & realization', breathingPattern: 'energizing' },
                { name: 'Integration', duration: 180, freq: 136.1, bothEars: 0, noiseType: null, soundscapeType: 'ocean', desc: 'Grounding the signal', breathingPattern: 'coherent' }
            ]
        }
    },
    {
        id: 'deep-sleep-descent',
        title: 'Deep Sleep Descent',
        icon: 'Moon',
        description: 'Fall asleep faster with Alpha -> Theta -> Delta progression',
        category: 'sleep',
        short: {
            duration: 900, // 15 minutes
            phases: [
                { name: 'Physical Release', duration: 180, freq: 1168, bothEars: 10, noiseType: 'pink', desc: 'Nogier G for muscle release', breathingPattern: '478' },
                { name: 'Theta Drift', duration: 240, freq: 136.1, bothEars: 4, noiseType: 'pink', desc: 'Om Frequency + Theta for relaxation', breathingPattern: '478' },
                { name: 'Delta Drop', duration: 300, freq: 100, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep onset', breathingPattern: '478' },
                { name: 'Subconscious Restore', duration: 120, freq: 292, bothEars: 1, noiseType: 'brown', desc: 'Nogier D for cellular repair', breathingPattern: 'coherent' },
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
                { name: 'Physical Release', duration: 540, freq: 1168, bothEars: 10, noiseType: 'pink', desc: 'Nogier G for muscle release', breathingPattern: '478' },
                { name: 'Theta Drift', duration: 600, freq: 136.1, bothEars: 4, noiseType: 'pink', desc: 'Om Frequency + Theta for relaxation', breathingPattern: '478' },
                { name: 'Delta Drop', duration: 900, freq: 100, bothEars: 2, noiseType: 'brown', desc: 'Deep sleep onset', breathingPattern: '478' },
                { name: 'Subconscious Restore', duration: 480, freq: 292, bothEars: 1, noiseType: 'brown', desc: 'Nogier D for cellular repair', breathingPattern: 'coherent' },
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
                { name: 'Blessing Tone', duration: 240, freq: 111, bothEars: 0, noiseType: null, desc: 'Angel frequency', breathingPattern: 'box' },
                { name: 'Rebuild', duration: 300, freq: 528, bothEars: 0, noiseType: null, desc: 'Repair', breathingPattern: 'box' }
            ]
        }
    },
    {
        id: 'energy-reboot',
        title: 'Morning Energy Reboot',
        icon: 'Sun',
        description: 'Wake up, energize, and prepare for a high-vibe day',
        category: 'energy',
        short: {
            duration: 600, // 10 minutes
            phases: [
                { name: 'Wake Up', duration: 120, freq: 396, bothEars: 15, noiseType: null, desc: 'Shake off grogginess', breathingPattern: 'energizing' },
                { name: 'Charge', duration: 180, freq: 528, bothEars: 20, noiseType: null, desc: 'Cellular activation', breathingPattern: 'energizing' },
                { name: 'Focus', duration: 180, freq: 741, bothEars: 18, noiseType: null, desc: 'Mental clarity', breathingPattern: 'box' },
                { name: 'Go Time', duration: 120, freq: 963, bothEars: 30, noiseType: null, desc: 'High beta/gamma peak', breathingPattern: 'energizing' }
            ]
        },
        long: {
            duration: 1800, // 30 minutes
            phases: [
                { name: 'Wake Up', duration: 300, freq: 396, bothEars: 15, noiseType: null, desc: 'Shake off grogginess', breathingPattern: 'energizing' },
                { name: 'Grounding', duration: 300, freq: 174, bothEars: 10, noiseType: null, desc: 'Rooting energy', breathingPattern: 'box' },
                { name: 'Charge', duration: 480, freq: 528, bothEars: 20, noiseType: null, desc: 'Cellular activation', breathingPattern: 'energizing' },
                { name: 'Focus', duration: 480, freq: 741, bothEars: 18, noiseType: null, desc: 'Mental clarity', breathingPattern: 'box' },
                { name: 'Go Time', duration: 240, freq: 963, bothEars: 30, noiseType: null, desc: 'High beta/gamma peak', breathingPattern: 'energizing' }
            ]
        }
    },
    {
        id: 'pain-relief-soothe',
        title: 'Somatic Pain Relief',
        icon: 'Activity',
        description: 'Targeted frequencies to lower inflammation and soothe nerves',
        category: 'body',
        short: {
            duration: 900, // 15 minutes
            phases: [
                { name: 'Nerve Calm', duration: 300, freq: 174, bothEars: 3, noiseType: 'pink', desc: 'Anesthetic frequency', breathingPattern: '478' },
                { name: 'Cellular Release', duration: 300, freq: 111, bothEars: 0, noiseType: 'brown', desc: 'Zeta waves for regeneration', breathingPattern: 'coherent' },
                { name: 'Schumann Ground', duration: 300, freq: 7.83, bothEars: 0, noiseType: 'brown', desc: 'Earth resonance', breathingPattern: 'vortex' }
            ]
        },
        long: {
            duration: 2700, // 45 minutes
            phases: [
                { name: 'Nerve Calm', duration: 600, freq: 174, bothEars: 3, noiseType: 'pink', desc: 'Anesthetic frequency', breathingPattern: '478' },
                { name: 'Deep Release', duration: 600, freq: 285, bothEars: 2, noiseType: 'brown', desc: 'Tissue repair tone', breathingPattern: '478' },
                { name: 'Cellular Release', duration: 900, freq: 111, bothEars: 0, noiseType: 'brown', desc: 'Zeta waves for regeneration', breathingPattern: 'coherent' },
                { name: 'Schumann Ground', duration: 600, freq: 7.83, bothEars: 0, noiseType: 'brown', desc: 'Earth resonance', breathingPattern: 'vortex' }
            ]
        }
    },
    {
        id: 'chakra-balancing-cascade',
        title: 'Chakra Cascade',
        icon: 'CircleDot',
        description: 'Systematic alignment from Root to Crown',
        category: 'spiritual',
        short: {
            duration: 1260, // 21 minutes (3 min per chakra)
            phases: [
                { name: 'Root', duration: 180, freq: 396, bothEars: 5, noiseType: 'brown', desc: 'Grounding', breathingPattern: 'coherent' },
                { name: 'Sacral', duration: 180, freq: 417, bothEars: 6, noiseType: null, desc: 'Creativity', breathingPattern: 'coherent' },
                { name: 'Solar Plexus', duration: 180, freq: 528, bothEars: 7, noiseType: null, desc: 'Power', breathingPattern: 'coherent' },
                { name: 'Heart', duration: 180, freq: 639, bothEars: 8, noiseType: null, desc: 'Love', breathingPattern: 'coherent' },
                { name: 'Throat', duration: 180, freq: 741, bothEars: 9, noiseType: null, desc: 'Expression', breathingPattern: 'coherent' },
                { name: 'Third Eye', duration: 180, freq: 852, bothEars: 10, noiseType: null, desc: 'Intuition', breathingPattern: 'coherent' },
                { name: 'Crown', duration: 180, freq: 963, bothEars: 12, noiseType: 'violet', desc: 'Connection', breathingPattern: 'coherent' }
            ]
        },
        long: {
            duration: 2520, // 42 minutes (6 min per chakra)
            phases: [
                { name: 'Root', duration: 360, freq: 396, bothEars: 5, noiseType: 'brown', desc: 'Grounding', breathingPattern: 'coherent' },
                { name: 'Sacral', duration: 360, freq: 417, bothEars: 6, noiseType: null, desc: 'Creativity', breathingPattern: 'coherent' },
                { name: 'Solar Plexus', duration: 360, freq: 528, bothEars: 7, noiseType: null, desc: 'Power', breathingPattern: 'coherent' },
                { name: 'Heart', duration: 360, freq: 639, bothEars: 8, noiseType: null, desc: 'Love', breathingPattern: 'coherent' },
                { name: 'Throat', duration: 360, freq: 741, bothEars: 9, noiseType: null, desc: 'Expression', breathingPattern: 'coherent' },
                { name: 'Third Eye', duration: 360, freq: 852, bothEars: 10, noiseType: null, desc: 'Intuition', breathingPattern: 'coherent' },
                { name: 'Crown', duration: 360, freq: 963, bothEars: 12, noiseType: 'violet', desc: 'Connection', breathingPattern: 'coherent' }
            ]
        }
    },
    {
        id: 'fibonacci-meditation',
        title: 'Golden Ratio Flow',
        icon: 'Hexagon', // Approximate for sacred geometry
        description: 'Harmonic series meditation scaling by Phi (1.618)',
        category: 'spiritual',
        short: {
            duration: 900, // 15 mins
            phases: [
                { name: 'Base 432', duration: 300, freq: 432, bothEars: 0, noiseType: 'pink', desc: 'Foundation', breathingPattern: 'vortex' },
                { name: 'Phi Layer 1', duration: 300, freq: 432, phiHarmonic: 699, bothEars: 0, noiseType: null, desc: 'Adding 699 Hz', breathingPattern: 'vortex' },
                { name: 'Phi Layer 2', duration: 300, freq: 432, phiHarmonic: 1131, bothEars: 0, noiseType: null, desc: 'Adding 1131 Hz', breathingPattern: 'vortex' }
            ]
        },
        long: {
            duration: 1800, // 30 mins
            phases: [
                { name: 'Base 432', duration: 600, freq: 432, bothEars: 0, noiseType: 'pink', desc: 'Foundation', breathingPattern: 'vortex' },
                { name: 'Phi Layer 1', duration: 600, freq: 432, phiHarmonic: 699, bothEars: 0, noiseType: null, desc: 'Adding 699 Hz', breathingPattern: 'vortex' },
                { name: 'Phi Layer 2', duration: 600, freq: 432, phiHarmonic: 1131, bothEars: 0, noiseType: null, desc: 'Adding 1131 Hz', breathingPattern: 'vortex' }
            ]
        }
    }
];
