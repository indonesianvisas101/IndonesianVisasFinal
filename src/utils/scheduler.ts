
/**
 * Executes a callback when the browser is idle, or after a timeout.
 * Falls back to setTimeout if requestIdleCallback is not supported.
 */
export const runWhenIdle = (callback: () => void, timeout = 2000) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout });
    } else {
        setTimeout(callback, 50); // Slight delay fallback
    }
};
