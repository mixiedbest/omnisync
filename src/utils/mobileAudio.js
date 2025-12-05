// Silent MP3 Data URI (Shortest possible valid MP3)
const SILENT_MP3 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIyLjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw//OEAAAAAAAAAAAAAAAAAAAAAAAAMGluZ2QAAAA8AAAABAAAASAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw//OEAAAAAAAAAAAAAAAAAAAAAAAATGF2YzU4LjUzAAAAAAAAAAAAAAAAIAGAAAAAAAAAAZAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAA';

let silentAudio = null;
let wakeLock = null;

/**
 * Enables "Background Mode" for mobile devices.
 * 1. Plays a silent HTML5 audio track to keep the AudioContext alive when locked.
 * 2. Requests a Screen Wake Lock to keep the screen on during the session.
 */
export const enableMobileAudio = async () => {
    // 1. Handle Background Audio Persistence
    if (!silentAudio) {
        silentAudio = new Audio(SILENT_MP3);
        silentAudio.loop = true;
        // iOS requires user interaction to start audio. 
        // We assume this function is called from a click handler (e.g. Play button).
    }

    try {
        if (silentAudio.paused) {
            await silentAudio.play();
            // console.log('Mobile background audio enabled');
        }
    } catch (e) {
        console.warn('Failed to enable background audio (interaction required?):', e);
    }

    // 2. Handle Screen Wake Lock
    if ('wakeLock' in navigator && !wakeLock) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            // console.log('Screen Wake Lock active');

            wakeLock.addEventListener('release', () => {
                // console.log('Screen Wake Lock released');
                wakeLock = null;
            });
        } catch (err) {
            // Wake Lock is optional enhancement, don't crash if it fails
            console.warn(`Wake Lock not available or failed: ${err.name}, ${err.message}`);
        }
    }
};

/**
 * Disables "Background Mode".
 */
export const disableMobileAudio = () => {
    // 1. Stop Background Audio
    if (silentAudio) {
        silentAudio.pause();
        silentAudio.currentTime = 0;
    }

    // 2. Release Wake Lock
    if (wakeLock) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
            })
            .catch(e => console.warn('Wake Lock release error', e));
    }
};
