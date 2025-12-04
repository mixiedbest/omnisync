// Planetary Frequencies (based on Hans Cousto's "Cosmic Octave")
export const planetaryFrequencies = {
    sun: {
        id: 'sun',
        name: 'Sun',
        frequency: 126.22,
        color: '#FDB813',
        chakra: 'Solar Plexus',
        purpose: 'Vitality, life force, core identity',
        icon: 'Sun',
        element: 'fire'
    },
    moon: {
        id: 'moon',
        name: 'Moon',
        frequency: 210.42,
        color: '#C0C0C0',
        chakra: 'Sacral',
        purpose: 'Emotions, intuition, subconscious',
        icon: 'Moon',
        element: 'water'
    },
    mercury: {
        id: 'mercury',
        name: 'Mercury',
        frequency: 141.27,
        color: '#87CEEB',
        chakra: 'Throat',
        purpose: 'Communication, intellect, mental clarity',
        icon: 'MessageCircle',
        element: 'air'
    },
    venus: {
        id: 'venus',
        name: 'Venus',
        frequency: 221.23,
        color: '#FF69B4',
        chakra: 'Heart',
        purpose: 'Love, beauty, harmony, relationships',
        icon: 'Heart',
        element: 'earth'
    },
    mars: {
        id: 'mars',
        name: 'Mars',
        frequency: 144.72,
        color: '#DC143C',
        chakra: 'Root',
        purpose: 'Action, courage, drive, passion',
        icon: 'Zap',
        element: 'fire'
    },
    jupiter: {
        id: 'jupiter',
        name: 'Jupiter',
        frequency: 183.58,
        color: '#DAA520',
        chakra: 'Third Eye',
        purpose: 'Expansion, wisdom, abundance, growth',
        icon: 'TrendingUp',
        element: 'fire'
    },
    saturn: {
        id: 'saturn',
        name: 'Saturn',
        frequency: 147.85,
        color: '#4B0082',
        chakra: 'Root',
        purpose: 'Structure, discipline, boundaries, karma',
        icon: 'Shield',
        element: 'earth'
    },
    uranus: {
        id: 'uranus',
        name: 'Uranus',
        frequency: 207.36,
        color: '#00CED1',
        chakra: 'Third Eye',
        purpose: 'Innovation, awakening, rebellion, freedom',
        icon: 'Sparkles',
        element: 'air'
    },
    neptune: {
        id: 'neptune',
        name: 'Neptune',
        frequency: 211.44,
        color: '#9370DB',
        chakra: 'Crown',
        purpose: 'Dreams, spirituality, transcendence, illusion',
        icon: 'Cloud',
        element: 'water'
    },
    pluto: {
        id: 'pluto',
        name: 'Pluto',
        frequency: 140.25,
        color: '#8B0000',
        chakra: 'Root',
        purpose: 'Transformation, rebirth, power, shadow work',
        icon: 'Flame',
        element: 'water'
    }
};

// Moon Phase Data
export const moonPhases = {
    newMoon: {
        id: 'newMoon',
        name: 'New Moon',
        emoji: '🌑',
        purpose: 'New beginnings, manifestation, planting seeds',
        frequencies: {
            base: 210.42, // Moon frequency
            binaural: 7, // Theta for deep intention
            harmonics: [111, 528] // New beginnings + Transformation
        },
        noise: 'violet',
        soundscape: 'cosmic',
        intention: 'Set intentions, start new projects, manifest desires'
    },
    waxingCrescent: {
        id: 'waxingCrescent',
        name: 'Waxing Crescent',
        emoji: '🌒',
        purpose: 'Growth, momentum, taking action',
        frequencies: {
            base: 210.42,
            binaural: 10, // Alpha for focus
            harmonics: [888, 528]
        },
        noise: 'green',
        soundscape: 'nature-walk',
        intention: 'Take inspired action, build momentum'
    },
    firstQuarter: {
        id: 'firstQuarter',
        name: 'First Quarter',
        emoji: '🌓',
        purpose: 'Decision-making, overcoming obstacles',
        frequencies: {
            base: 144.72, // Mars (action)
            binaural: 14, // Beta for clarity
            harmonics: [741, 852]
        },
        noise: 'blue',
        soundscape: 'wind',
        intention: 'Make decisions, push through challenges'
    },
    waxingGibbous: {
        id: 'waxingGibbous',
        name: 'Waxing Gibbous',
        emoji: '🌔',
        purpose: 'Refinement, adjustment, patience',
        frequencies: {
            base: 221.23, // Venus (harmony)
            binaural: 8, // Theta for patience
            harmonics: [639, 432]
        },
        noise: 'pink',
        soundscape: 'ocean',
        intention: 'Refine your approach, stay patient'
    },
    fullMoon: {
        id: 'fullMoon',
        name: 'Full Moon',
        emoji: '🌕',
        purpose: 'Release, completion, illumination, peak energy',
        frequencies: {
            base: 210.42,
            binaural: 40, // Gamma for peak awareness
            harmonics: [963, 852] // Higher consciousness
        },
        noise: 'white',
        soundscape: 'cosmic',
        intention: 'Release what no longer serves, celebrate achievements'
    },
    waningGibbous: {
        id: 'waningGibbous',
        name: 'Waning Gibbous',
        emoji: '🌖',
        purpose: 'Gratitude, sharing, teaching',
        frequencies: {
            base: 639, // Heart connection
            binaural: 6, // Theta for gratitude
            harmonics: [528, 432]
        },
        noise: 'pink',
        soundscape: 'japanese-garden',
        intention: 'Express gratitude, share your wisdom'
    },
    lastQuarter: {
        id: 'lastQuarter',
        name: 'Last Quarter',
        emoji: '🌗',
        purpose: 'Forgiveness, letting go, release',
        frequencies: {
            base: 396, // Release fear/guilt
            binaural: 4, // Delta for deep release
            harmonics: [417, 174]
        },
        noise: 'brown',
        soundscape: 'earth',
        intention: 'Forgive, let go, release attachments'
    },
    waningCrescent: {
        id: 'waningCrescent',
        name: 'Waning Crescent',
        emoji: '🌘',
        purpose: 'Rest, reflection, surrender, preparation',
        frequencies: {
            base: 432, // Universal harmony
            binaural: 2.5, // Delta for deep rest
            harmonics: [174, 285]
        },
        noise: 'grey',
        soundscape: 'rain',
        intention: 'Rest deeply, reflect, prepare for rebirth'
    }
};

// Calculate current moon phase (simplified algorithm)
export function getCurrentMoonPhase() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Simplified lunation calculation
    // Reference: Known new moon (Jan 11, 2024)
    const knownNewMoon = new Date(2024, 0, 11);
    const lunarCycle = 29.53059; // days

    const daysSinceKnown = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceKnown % lunarCycle) / lunarCycle;

    // Map phase to moon phase names
    if (phase < 0.0625 || phase >= 0.9375) return moonPhases.newMoon;
    if (phase < 0.1875) return moonPhases.waxingCrescent;
    if (phase < 0.3125) return moonPhases.firstQuarter;
    if (phase < 0.4375) return moonPhases.waxingGibbous;
    if (phase < 0.5625) return moonPhases.fullMoon;
    if (phase < 0.6875) return moonPhases.waningGibbous;
    if (phase < 0.8125) return moonPhases.lastQuarter;
    return moonPhases.waningCrescent;
}

// Planetary rulers for zodiac signs
export const zodiacRulers = {
    aries: 'mars',
    taurus: 'venus',
    gemini: 'mercury',
    cancer: 'moon',
    leo: 'sun',
    virgo: 'mercury',
    libra: 'venus',
    scorpio: 'pluto',
    sagittarius: 'jupiter',
    capricorn: 'saturn',
    aquarius: 'uranus',
    pisces: 'neptune'
};
