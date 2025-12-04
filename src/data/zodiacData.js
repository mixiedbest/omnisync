export const zodiacData = {
    aries: { id: 'aries', name: 'Aries', element: 'fire', ruler: 'Mars', dates: 'Mar 21 - Apr 19' },
    taurus: { id: 'taurus', name: 'Taurus', element: 'earth', ruler: 'Venus', dates: 'Apr 20 - May 20' },
    gemini: { id: 'gemini', name: 'Gemini', element: 'air', ruler: 'Mercury', dates: 'May 21 - Jun 20' },
    cancer: { id: 'cancer', name: 'Cancer', element: 'water', ruler: 'Moon', dates: 'Jun 21 - Jul 22' },
    leo: { id: 'leo', name: 'Leo', element: 'fire', ruler: 'Sun', dates: 'Jul 23 - Aug 22' },
    virgo: { id: 'virgo', name: 'Virgo', element: 'earth', ruler: 'Mercury', dates: 'Aug 23 - Sep 22' },
    libra: { id: 'libra', name: 'Libra', element: 'air', ruler: 'Venus', dates: 'Sep 23 - Oct 22' },
    scorpio: { id: 'scorpio', name: 'Scorpio', element: 'water', ruler: 'Pluto', dates: 'Oct 23 - Nov 21' },
    sagittarius: { id: 'sagittarius', name: 'Sagittarius', element: 'fire', ruler: 'Jupiter', dates: 'Nov 22 - Dec 21' },
    capricorn: { id: 'capricorn', name: 'Capricorn', element: 'earth', ruler: 'Saturn', dates: 'Dec 22 - Jan 19' },
    aquarius: { id: 'aquarius', name: 'Aquarius', element: 'air', ruler: 'Uranus', dates: 'Jan 20 - Feb 18' },
    pisces: { id: 'pisces', name: 'Pisces', element: 'water', ruler: 'Neptune', dates: 'Feb 19 - Mar 20' }
};

export const elementProfiles = {
    fire: {
        id: 'fire',
        name: 'Fire',
        signs: ['aries', 'leo', 'sagittarius'],
        purpose: 'Activate energy, courage, passion, creativity',
        frequencies: {
            base: 528, // Transformation
            binaural: 40, // Gamma (Focus/Peak)
            harmonics: [963, 888] // Higher consciousness, Abundance
        },
        noise: 'violet', // Activation/Clarity (closest to Blue/Violet mix)
        soundscape: 'firewood',
        desc: 'Solar plexus tones, brass/metallic resonance, solar wind.'
    },
    earth: {
        id: 'earth',
        name: 'Earth',
        signs: ['taurus', 'virgo', 'capricorn'],
        purpose: 'Grounding, stability, embodiment, protection',
        frequencies: {
            base: 174, // Pain relief/Grounding
            binaural: 7.83, // Schumann Resonance
            harmonics: [285, 639] // Physical balance, Harmony
        },
        noise: 'brown', // Grounding
        soundscape: 'earth', // Deep rumble/Forest
        desc: 'Root chakra tones, bass, hum, low drums, subharmonic textures.'
    },
    air: {
        id: 'air',
        name: 'Air',
        signs: ['gemini', 'libra', 'aquarius'],
        purpose: 'Clarity, creativity, thinking, communication',
        frequencies: {
            base: 741, // Clarity/Expression
            binaural: 14, // Beta (Concentration)
            harmonics: [852, 444] // Intuition, Protection
        },
        noise: 'white', // Mental clarity (or Turquoise/Blue)
        soundscape: 'wind', // Chimes/Airy
        desc: 'Throat/Third eye tones, wind chimes, flutes, airy resonance.'
    },
    water: {
        id: 'water',
        name: 'Water',
        signs: ['cancer', 'scorpio', 'pisces'],
        purpose: 'Emotional regulation, intuition, healing',
        frequencies: {
            base: 396, // Release fear
            binaural: 6, // Theta (Deep emotion)
            harmonics: [417, 528] // Transformation, Miracle
        },
        noise: 'pink', // Calm/Sleep
        soundscape: 'ocean', // Waves/Water
        desc: 'Heart + Sacral tones, warm fluid harmonics, singing bowls.'
    }
};

export const intentionProfiles = {
    romance: {
        id: 'romance',
        title: 'Romance & Love',
        base: 639, // Connection
        binaural: 6, // Theta (Intimacy)
        desc: 'Heart opening, bonding, soft breath pulse.'
    },
    healing: {
        id: 'healing',
        title: 'Healing & Resolution',
        base: 396, // Release
        binaural: 4, // Delta/Theta bridge
        desc: 'Releasing fear, transformation, deep peace.'
    },
    communication: {
        id: 'communication',
        title: 'Communication',
        base: 741, // Expression
        binaural: 10, // Alpha (Clarity)
        desc: 'Clear speech, intuition, understanding.'
    },
    creativity: {
        id: 'creativity',
        title: 'Creativity & Flow',
        base: 432, // Coherence
        binaural: 40, // Gamma (Flow)
        desc: 'Coherence, flow state, collaborative energy.'
    },
    family: {
        id: 'family',
        title: 'Family & Unity',
        base: 528, // Transformation/Miracle
        binaural: 8, // Alpha (Harmony)
        desc: 'Unity, unconditional love, collective harmony.'
    },
    calming: {
        id: 'calming',
        title: 'Calming & Peace',
        base: 432, // Universal harmony
        binaural: 4, // Theta (Deep calm)
        desc: 'Soothing tensions, peaceful coexistence, gentle presence.'
    }
};

export function getZodiacSign(day, month) {
    if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return zodiacData.capricorn;
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return zodiacData.aquarius;
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return zodiacData.pisces;
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return zodiacData.aries;
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return zodiacData.taurus;
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return zodiacData.gemini;
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return zodiacData.cancer;
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return zodiacData.leo;
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return zodiacData.virgo;
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return zodiacData.libra;
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return zodiacData.scorpio;
    if ((month == 11 && day >= 22) || (month == 12 && day >= 21)) return zodiacData.sagittarius;
    return zodiacData.aries;
}

// Simple Moon Sign Approximation (Not exact, but usable for demo)
// In a real app, we'd use an ephemeris library.
// For now, we might ask the user to input it or just stick to Sun sign if we can't calculate.
// Or we can provide a link to "Find your moon sign" and let them select it.
