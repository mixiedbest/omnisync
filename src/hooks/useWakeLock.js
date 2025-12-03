import { useRef, useEffect } from 'react';

export function useWakeLock(isPlaying) {
    const wakeLockRef = useRef(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator && isPlaying) {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock activated');
                }
            } catch (err) {
                console.error('Wake Lock error:', err);
            }
        };

        const releaseWakeLock = async () => {
            if (wakeLockRef.current) {
                try {
                    await wakeLockRef.current.release();
                    wakeLockRef.current = null;
                    console.log('Wake Lock released');
                } catch (err) {
                    console.error('Wake Lock release error:', err);
                }
            }
        };

        if (isPlaying) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        // Re-request wake lock if page becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            releaseWakeLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPlaying]);

    return null;
}
