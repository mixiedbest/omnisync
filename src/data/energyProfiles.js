export const energyProfiles = [
    {
        id: 'clarity',
        title: 'CLARITY',
        icon: 'Diamond',
        color: 'from-blue-900 to-cyan-900',
        description: 'Mental focus and clear thinking',
        short: {
            duration: 180, // 3 minutes
            frequencies: { left: 852, right: 852, bothEars: 14 }, // 852 Hz (intuition) + 14 Hz Beta
            noiseType: 'blue',
            soundscapeType: null
        },
        long: {
            duration: 1800, // 30 minutes
            frequencies: { left: 852, right: 852, bothEars: 10 }, // + 10 Hz Alpha
            noiseType: 'green',
            soundscapeType: 'nature-walk'
        }
    },
    {
        id: 'strength',
        title: 'STRENGTH',
        icon: 'Zap',
        color: 'from-red-900 to-orange-900',
        description: 'Inner power and resilience',
        short: {
            duration: 180,
            frequencies: { left: 396, right: 396, bothEars: 20 }, // 396 Hz (root) + 20 Hz Beta
            noiseType: 'brown',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 396, right: 396, bothEars: 7.83 }, // + Schumann
            noiseType: 'brown',
            soundscapeType: 'earth'
        }
    },
    {
        id: 'confidence',
        title: 'CONFIDENCE',
        icon: 'Flame',
        color: 'from-yellow-900 to-orange-900',
        description: 'Self-assurance and courage',
        short: {
            duration: 180,
            frequencies: { left: 528, right: 528, bothEars: 18 }, // 528 Hz (transformation) + 18 Hz Beta
            noiseType: 'yellow',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 528, right: 528, bothEars: 10 },
            noiseType: 'orange',
            soundscapeType: 'firewood'
        }
    },
    {
        id: 'love',
        title: 'LOVE',
        icon: 'Heart',
        color: 'from-pink-900 to-rose-900',
        description: 'Heart opening and compassion',
        short: {
            duration: 180,
            frequencies: { left: 639, right: 639, bothEars: 8 }, // 639 Hz (heart) + 8 Hz Theta
            noiseType: 'pink',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 639, right: 639, bothEars: 7 },
            noiseType: 'pink',
            soundscapeType: 'japanese-garden'
        }
    },
    {
        id: 'peace',
        title: 'PEACE',
        icon: 'Feather',
        color: 'from-indigo-900 to-purple-900',
        description: 'Deep calm and tranquility',
        short: {
            duration: 180,
            frequencies: { left: 432, right: 432, bothEars: 6 }, // 432 Hz + 6 Hz Theta
            noiseType: 'pink',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 432, right: 432, bothEars: 4 },
            noiseType: 'pink',
            soundscapeType: 'ocean'
        }
    },
    {
        id: 'protection',
        title: 'PROTECTION',
        icon: 'Shield',
        color: 'from-purple-900 to-violet-900',
        description: 'Energetic boundaries and safety',
        short: {
            duration: 180,
            frequencies: { left: 741, right: 741, bothEars: 10 }, // 741 Hz (detox) + 10 Hz Alpha
            noiseType: 'violet',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 741, right: 741, bothEars: 7.83 },
            noiseType: 'grey',
            soundscapeType: 'cosmic'
        }
    },
    {
        id: 'creativity',
        title: 'CREATIVITY',
        icon: 'Palette',
        color: 'from-orange-900 to-yellow-900',
        description: 'Flow state and inspiration',
        short: {
            duration: 180,
            frequencies: { left: 417, right: 417, bothEars: 10 }, // 417 Hz (change) + 10 Hz Alpha
            noiseType: 'green',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 417, right: 417, bothEars: 8 },
            noiseType: 'green',
            soundscapeType: 'rain'
        }
    },
    {
        id: 'flow',
        title: 'FLOW',
        icon: 'Waves',
        color: 'from-teal-900 to-cyan-900',
        description: 'Effortless productivity',
        short: {
            duration: 180,
            frequencies: { left: 285, right: 285, bothEars: 14 }, // 285 Hz (healing) + 14 Hz Beta
            noiseType: 'turquoise',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 285, right: 285, bothEars: 10 },
            noiseType: 'green',
            soundscapeType: 'waterfall'
        }
    },
    {
        id: 'motivation',
        title: 'MOTIVATION',
        icon: 'Rocket',
        color: 'from-red-900 to-pink-900',
        description: 'Drive and determination',
        short: {
            duration: 180,
            frequencies: { left: 396, right: 396, bothEars: 20 }, // 396 Hz (root) + 20 Hz High Beta
            noiseType: 'orange',
            soundscapeType: null
        },
        long: {
            duration: 1800,
            frequencies: { left: 528, right: 528, bothEars: 18 }, // 528 Hz (transformation) + 18 Hz Beta
            noiseType: 'yellow',
            soundscapeType: 'firewood'
        }
    }
];
