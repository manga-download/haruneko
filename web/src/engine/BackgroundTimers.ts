//const worker = new Worker(new URL('./BackgroundTimersWorker.ts', import.meta.url));

export function SetTimeout(callback: () => void, ms: number): number {
    //worker.onmessage = event => console.log(event);
    //worker.postMessage('...', );
    return window.setTimeout(callback, ms);
}

export function ClearTimeout(id: number): void {
    window.clearTimeout(id);
}

export function SetInterval(callback: () => void, ms: number): number {
    return window.setInterval(callback, ms);
}

export function ClearInterval(id: number): void {
    window.clearInterval(id);
}