import { useCallback, useEffect, useState } from 'react';

export const useHaptics = () => {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported('vibrate' in navigator);
    }, []);

    // Single vibration
    const pulse = useCallback((duration = 50) => {
        if (!isSupported) return;
        try {
            navigator.vibrate(duration);
        } catch (e) {
            console.warn("Haptics Error:", e);
        }
    }, [isSupported]);

    // Rhythmic pattern: [vibrate, pause, vibrate, pause...]
    const pattern = useCallback((sequence) => {
        if (!isSupported) return;
        try {
            navigator.vibrate(sequence);
        } catch (e) {
            console.warn("Haptics Error:", e);
        }
    }, [isSupported]);

    // Stop vibration
    const stop = useCallback(() => {
        if (!isSupported) return;
        try {
            navigator.vibrate(0);
        } catch (e) {
            console.warn("Haptics Error:", e);
        }
    }, [isSupported]);

    return { pulse, pattern, stop, isSupported };
};
