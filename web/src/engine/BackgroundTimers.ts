type Action = () => void;
type Payload = { action: string } & Record<string, any>;

const worker = new Worker(new URL('./BackgroundTimersWorker.ts', import.meta.url), { type: 'module' });
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
    console.log(new Date().toISOString(), 'TickTimeout', timerID, timeoutCallbacks.get(timerID));
    if(timeoutCallbacks.has(timerID)) {
        timeoutCallbacks.get(timerID).call(undefined);
        timeoutCallbacks.delete(timerID);
    }
}

function TickInterval(timerID: number): void {
    console.log(new Date().toISOString(), 'TickInterval', timerID, intervalCallbacks.get(timerID));
    if(intervalCallbacks.has(timerID)) {
        intervalCallbacks.get(timerID).call(undefined);
    }
}

export function SetTimeout(callback: Action, ms: number): Promise<number> {
    return new Promise<number>(resolve => {
        const _uid = GenerateUID();
        function responseListener(event: MessageEvent<Payload>) {
            console.log(new Date().toISOString(), event.data);
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

export function ClearTimeout(timerID: number): void {
    timeoutCallbacks.delete(timerID);
    worker.postMessage({ action: 'Worker::ClearTimeout', timerID });
}

export function SetInterval(callback: Action, ms: number): Promise<number> {
    return new Promise<number>(resolve => {
        const _uid = GenerateUID();
        function responseListener(event: MessageEvent<Payload>) {
            console.log(new Date().toISOString(), event.data);
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

export function ClearInterval(timerID: number): void {
    intervalCallbacks.delete(timerID);
    worker.postMessage({ action: 'Worker::ClearInterval', timerID });
}