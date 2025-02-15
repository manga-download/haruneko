/**
 * This module provides various timing methods which will not hibernate when the application is in the background.
 * @see {@link https://developer.chrome.com/blog/timer-throttling-in-chrome-88}
 */

import BackgroundTimersWorker from './BackgroundTimersWorker.ts?worker&inline';

type Action = () => void;
type Payload = { action: string } & Record<string, any>;

const worker = new BackgroundTimersWorker();
const timeoutCallbacks = new Map<number, Action>();
const intervalCallbacks = new Map<number, Action>();

function GenerateUID() {
    return `${Date.now()}${Math.random()}`;
}

worker.addEventListener('message', event => {
    switch(event.data.action) {
        case 'BackgroundTimers::TickTimeout': return TickTimeout(event.data.timerID);
        case 'BackgroundTimers::TickInterval': return TickInterval(event.data.timerID);
    }
});

function TickTimeout(timerID: number): void {
    if(timeoutCallbacks.has(timerID)) {
        timeoutCallbacks.get(timerID).call(undefined);
        timeoutCallbacks.delete(timerID);
    }
}

function TickInterval(timerID: number): void {
    if(intervalCallbacks.has(timerID)) {
        intervalCallbacks.get(timerID).call(undefined);
    }
}

/**
 * Return a promise that resolves after the given {@link ms}.
 * When a {@link variance} is provided, the promise will resolve randomly between {@link ms} ± {@link variance}.
 */
export async function Delay(ms: number, variance = 0): Promise<void> {
    const delay = variance > 0 && variance < ms ? ms - variance + 2 * variance * Math.random() : ms;
    return new Promise<void>(resolve => SetTimeout(resolve, delay));
}

/**
 * {@inheritDoc setTimeout}
 * @see {@link setTimeout}
 */
export function SetTimeout(callback: Action, ms: number): Promise<number> {
    return new Promise<number>(resolve => {
        const _uid = GenerateUID();
        function responseListener(event: MessageEvent<Payload>) {
            if(event.data.action === _uid) {
                worker.removeEventListener('message', responseListener);
                timeoutCallbacks.set(event.data.timerID, callback);
                resolve(event.data.timerID);
            }
        }
        worker.addEventListener('message', responseListener);
        worker.postMessage({ action: 'Worker::SetTimeout', ms, _uid });
    });
}

/**
 * {@inheritDoc clearTimeout}
 * @see {@link clearTimeout}
 */
export function ClearTimeout(timerID: number): void {
    timeoutCallbacks.delete(timerID);
    worker.postMessage({ action: 'Worker::ClearTimeout', timerID });
}

/**
 * {@inheritDoc setInterval}
 * @see {@link setInterval}
 */
export function SetInterval(callback: Action, ms: number): Promise<number> {
    return new Promise<number>(resolve => {
        const _uid = GenerateUID();
        function responseListener(event: MessageEvent<Payload>) {
            if(event.data.action === _uid) {
                worker.removeEventListener('message', responseListener);
                intervalCallbacks.set(event.data.timerID, callback);
                resolve(event.data.timerID);
            }
        }
        worker.addEventListener('message', responseListener);
        worker.postMessage({ action: 'Worker::SetInterval', ms, _uid });
    });
}

/**
 * {@inheritDoc clearInterval}
 * @see {@link clearInterval}
 */
export function ClearInterval(timerID: number): void {
    intervalCallbacks.delete(timerID);
    worker.postMessage({ action: 'Worker::ClearInterval', timerID });
}