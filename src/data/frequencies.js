export const categories = [
    {
        id: "healing",
        title: "HEALING (Nogier Frequencies)",
        icon: "Activity",
        color: "from-red-900 to-orange-900",
        items: [
            { id: "h1", title: "Pain Relief (Nogier G)", beat: 0, left: 1168, right: 1168, desc: "Resonates with Mesoderm (bones, muscles). Structural pain relief." },
            { id: "h2", title: "Nausea / Gut Reset (Nogier E)", beat: 0, left: 584, right: 584, desc: "Resonates with Endoderm (GI tract, liver). Digestion aid." },
            { id: "h3", title: "Nervous System Reboot (Nogier D)", beat: 0, left: 292, right: 292, desc: "Resonates with Ectoderm (skin, nerves). Cellular repair." },
            { id: "h4", title: "Migraine Softener (Alpha + Epsilon)", beat: 10, left: 100, right: 110, desc: "Stabilizes brain (10Hz) with slow Epsilon modulation (0.5Hz)." },
            { id: "h5", title: "Immune / Inflammation (Nogier B)", beat: 0, left: 2336, right: 2336, desc: "Metabolic balance and fighting chronic inflammation." },
            { id: "h6", title: "Universal Healing (Nogier A)", beat: 0, left: 292, right: 292, desc: "General cellular vitality and tissue repair." },
        ]
    },
    {
        id: "chakras",
        title: "CHAKRAS (Solfeggio & Planetary)",
        icon: "CircleDot",
        color: "from-pink-900 to-rose-900",
        items: [
            { id: "c1", title: "Root (Grounding)", beat: 7.83, left: 396, right: 403.83, desc: "Default: 396 Hz. Planetary Alt: Earth Day (194.18 Hz)." },
            { id: "c2", title: "Sacral (Creativity)", beat: 6, left: 417, right: 423, desc: "Default: 417 Hz. Planetary Alt: Synodic Moon (210.42 Hz)." },
            { id: "c3", title: "Solar Plexus (Power)", beat: 8, left: 528, right: 536, desc: "Default: 528 Hz. Planetary Alt: Sun (126.22 Hz)." },
            { id: "c4", title: "Heart (Love)", beat: 10, left: 639, right: 649, desc: "Default: 639 Hz. Planetary Alt: Earth Year/Om (136.10 Hz)." },
            { id: "c5", title: "Throat (Truth)", beat: 12, left: 741, right: 753, desc: "Default: 741 Hz. Planetary Alt: Mercury (141.27 Hz)." },
            { id: "c6", title: "Third Eye (Intuition)", beat: 30, left: 852, right: 882, desc: "Default: 852 Hz. Planetary Alt: Venus (221.23 Hz)." },
            { id: "c7", title: "Crown (Spirit)", beat: 40, left: 963, right: 1003, desc: "Default: 963 Hz. Planetary Alt: Platonic Year (172.06 Hz)." },
        ]
    },
    {
        id: "focus",
        title: "FOCUS & MENTAL PERFORMANCE",
        icon: "Zap",
        color: "from-blue-900 to-indigo-900",
        items: [
            { id: "f1", title: "Laser Focus (Gamma 40Hz)", beat: 40, left: 200, right: 240, desc: "High-level processing, coding, complex work." },
            { id: "f2", title: "Idea Generator (Theta 7.83Hz)", beat: 7.83, left: 100, right: 107.83, desc: "Twilight state for creative flow and brainstorming." },
            { id: "f3", title: "ADHD Hyperfocus (SMR 14Hz)", beat: 14, left: 128, right: 142, desc: "Sensorimotor Rhythm. Calm body, active mind." },
            { id: "f4", title: "Memory Recall (Low Beta 15Hz)", beat: 15, left: 160, right: 175, desc: "Active testing and recall without high-beta anxiety." },
        ]
    },
    {
        id: "manifestation",
        title: "MANIFESTATION & INTENTION",
        icon: "Sparkles",
        color: "from-violet-900 to-purple-900",
        items: [
            { id: "m1", title: "Money Magnet (Jupiter 183.58Hz)", beat: 12, left: 183.58, right: 195.58, desc: "Frequency of expansion, luck, growth, and abundance." },
            { id: "m2", title: "Reality Shift (Phase Shift 8Hz)", beat: 8, left: 200, right: 208, desc: "Bridge between conscious and subconscious minds." },
            { id: "m3", title: "Quantum Field (Natural 432Hz)", beat: 0, left: 432, right: 432, desc: "Mathematical consistency for universal alignment." },
        ]
    },
    {
        id: "body",
        title: "BODY-BASED / SOMATIC",
        icon: "Heart",
        color: "from-emerald-900 to-green-900",
        items: [
            { id: "b1", title: "Vagus Nerve Reset (100Hz)", beat: 4, left: 100, right: 104, desc: "Mimics chest resonance of a low 'Ohm' chant." },
            { id: "b2", title: "Lymphatic Flow (50Hz)", beat: 50, left: 100, right: 150, desc: "Muscle stimulation tone for fluid movement." },
            { id: "b3", title: "Organ Regeneration (111Hz)", beat: 0, left: 111, right: 111, desc: "High Beta associated with cell rejuvenation." },
        ]
    },
    {
        id: "spiritual",
        title: "SPIRITUAL ASCENSION (Psychedelic)",
        icon: "Eye",
        color: "from-indigo-900 to-violet-900",
        items: [
            { id: "s1", title: "DMT Field (Lambda/Epsilon)", beat: 0.1, left: 200, right: 200.1, desc: "Layers extremely slow (0.1Hz) with fast waves." },
            { id: "s2", title: "Astral Projection (Theta 6.3Hz)", beat: 6.3, left: 150, right: 156.3, desc: "Specific portal frequency for out-of-body states." },
            { id: "s3", title: "Third Eye Opening (936Hz)", beat: 30, left: 936, right: 966, desc: "Pineal activation pitch, distinct from Solfeggio." },
        ]
    },
    {
        id: "angels",
        title: "ANGEL FREQUENCIES",
        icon: "Feather",
        color: "from-yellow-900 to-amber-900",
        items: [
            { id: "a1", title: "111 Hz (New Beginnings)", beat: 10, left: 111, right: 121, desc: "Backed with Alpha (10Hz) for clear mind." },
            { id: "a2", title: "444 Hz (Protection)", beat: 4, left: 444, right: 448, desc: "Backed with Theta (4Hz) for safety/grounding." },
            { id: "a3", title: "888 Hz (Abundance)", beat: 12, left: 888, right: 900, desc: "Backed with Jupiter (183.58Hz) for double luck." },
            { id: "a7", title: "777 Hz (Intuition)", beat: 7, left: 777, right: 784, desc: "Divine connection and intuitive flow." },
        ]
    },
    {
        id: "tinnitus",
        title: "TINNITUS RELIEF",
        icon: "Ear",
        color: "from-indigo-900 to-violet-900",
        items: [
            {
                id: "tin1",
                title: "High-Tone Soother",
                beat: 0.5,
                left: 10000,
                right: 10000.5,
                noiseType: "pink",
                desc: "Gentle high-frequency masking (8-12 kHz range). Wideband hiss with warm pink noise.",
                volumes: { noise: 0.3, binaural: 0.2 }
            },
            {
                id: "tin2",
                title: "Brain Quieting Tone",
                beat: 2.5,
                left: 100,
                right: 102.5,
                noiseType: "brown",
                desc: "Deep delta waves (2.5 Hz) to reduce tinnitus intensity through relaxation.",
                volumes: { noise: 0.25, binaural: 0.4 }
            },
            {
                id: "tin3",
                title: "Notched Noise Therapy",
                beat: 0,
                left: 0,
                right: 0,
                noiseType: "white",
                desc: "White noise therapy designed to desensitize neurons at tinnitus frequency.",
                volumes: { noise: 0.35 }
            },
            {
                id: "tin4",
                title: "Ocean Masker",
                beat: 0.15,
                left: 60,
                right: 60.15,
                noiseType: "pink",
                type: "ocean",
                desc: "Natural ocean-like movement with slow wave modulation (0.1-0.2 Hz).",
                volumes: { noise: 0.3, soundscape: 0.4, binaural: 0.15 }
            },
            {
                id: "tin6",
                title: "Neuromodulation Sweep",
                beat: 8,
                left: 500,
                right: 508,
                noiseType: "white",
                desc: "Slowly sweeping tone (500-8000 Hz cycle) interrupts neural firing patterns.",
                volumes: { noise: 0.25, binaural: 0.3 }
            },
            {
                id: "tin9",
                title: "Sleep Tinnitus Masker",
                beat: 0.5,
                left: 396,
                right: 396.5,
                noiseType: "brown",
                desc: "Warm brown/pink noise mix with gentle 0.5 Hz delta pulse.",
                volumes: { noise: 0.35, binaural: 0.25 }
            }
        ]
    },
    {
        id: "golden-harmonics",
        title: "GOLDEN HARMONICS",
        icon: "Sparkles",
        color: "from-amber-900 to-yellow-900",
        items: [
            {
                id: "gh1",
                title: "Phi Root (432 Hz)",
                beat: 0,
                left: 432,
                right: 432,
                desc: "Grounded base frequency - The foundation of golden ratio scaling. Pure 432 Hz resonance."
            },
            {
                id: "gh2",
                title: "Heart Coherence (699 Hz)",
                beat: 0,
                left: 699,
                right: 699,
                desc: "432 × φ - Emotional balance and heart chakra resonance. First golden harmonic."
            },
            {
                id: "gh3",
                title: "Higher Awareness (1131 Hz)",
                beat: 0,
                left: 1131,
                right: 1131,
                desc: "699 × φ - Intuition and clarity. Second golden harmonic ascension."
            },
            {
                id: "gh4",
                title: "Grounding Calm (267 Hz)",
                beat: 0,
                left: 267,
                right: 267,
                desc: "432 ÷ φ - Nervous system calm and deep grounding. Golden descent."
            },
            {
                id: "gh5",
                title: "Root Phi Pair",
                beat: 0,
                left: 396,
                right: 641,
                desc: "Root chakra (396 Hz) with φ expansion (641 Hz). Sacred geometry alignment."
            },
            {
                id: "gh6",
                title: "Sacral Phi Pair",
                beat: 0,
                left: 417,
                right: 675,
                desc: "Sacral chakra (417 Hz) with φ expansion (675 Hz). Creative flow amplified."
            },
            {
                id: "gh7",
                title: "Solar Phi Pair",
                beat: 0,
                left: 528,
                right: 854,
                desc: "Solar plexus (528 Hz) with φ expansion (854 Hz). Power and transformation."
            },
            {
                id: "gh8",
                title: "Heart Phi Pair",
                beat: 0,
                left: 639,
                right: 1034,
                desc: "Heart chakra (639 Hz) with φ expansion (1034 Hz). Love field expansion."
            },
            {
                id: "gh9",
                title: "Throat Phi Pair",
                beat: 0,
                left: 741,
                right: 1199,
                desc: "Throat chakra (741 Hz) with φ expansion (1199 Hz). Truth amplification."
            },
            {
                id: "gh10",
                title: "Third Eye Phi Pair",
                beat: 0,
                left: 852,
                right: 1379,
                desc: "Third eye (852 Hz) with φ expansion (1379 Hz). Intuitive vision enhanced."
            },
            {
                id: "gh11",
                title: "Crown Phi Pair",
                beat: 0,
                left: 963,
                right: 1558,
                desc: "Crown chakra (963 Hz) with φ expansion (1558 Hz). Spiritual connection magnified."
            },
            {
                id: "gh12",
                title: "Golden Drone Layer",
                beat: 0,
                left: 432,
                right: 699,
                desc: "Base (432 Hz) + First harmonic (699 Hz). Perfect φ relationship for meditation."
            }
        ]
    }
];
