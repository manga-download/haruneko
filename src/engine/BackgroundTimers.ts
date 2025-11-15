/**
 * This module provides various timing methods.
 * Node.js version - uses standard timers
 */

type Action = () => void;

/**
 * Return a promise that resolves after the given {@link ms}.
 * When a {@link variance} is provided, the promise will resolve randomly between {@link ms} ± {@link variance}.
 */
export async function Delay(ms: number, variance = 0): Promise<void> {
    const delay = variance > 0 && variance < ms ? ms - variance + 2 * variance * Math.random() : ms;
    return new Promise<void>(resolve => setTimeout(resolve, delay));
}

/**
 * Set a timeout that returns a promise resolving to the timer ID
 */
export async function SetTimeout(callback: Action, ms: number): Promise<NodeJS.Timeout> {
    return new Promise<NodeJS.Timeout>(resolve => {
        const id = setTimeout(() => {
            callback();
        }, ms);
        resolve(id);
    });
}

/**
 * Clear a timeout
 */
export function ClearTimeout(timerID: NodeJS.Timeout): void {
    clearTimeout(timerID);
}

/**
 * Set an interval that returns a promise resolving to the timer ID
 */
export function SetInterval(callback: Action, ms: number): Promise<NodeJS.Timeout> {
    return new Promise<NodeJS.Timeout>(resolve => {
        const id = setInterval(callback, ms);
        resolve(id);
    });
}

/**
 * Clear an interval
 */
export function ClearInterval(timerID: NodeJS.Timeout): void {
    clearInterval(timerID);
}
