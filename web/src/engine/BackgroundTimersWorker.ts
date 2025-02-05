/// <reference lib="webworker" />

type Payload = { action: string } & Record<string, any>;

addEventListener('message', (event: MessageEvent<Payload>) => {
    const payload = event.data;
    switch(payload.action) {
        case 'Worker::SetTimeout': return SetTimeout(payload._uid, payload.ms);
        case 'Worker::ClearTimeout': return ClearTimeout(payload.timerID);
        case 'Worker::SetInterval': return SetInterval(payload._uid, payload.ms);
        case 'Worker::ClearInterval': return ClearInterval(payload.timerID);
    }
});

function SetTimeout(uid: string, ms: number): void {
    const timerID = setTimeout(() => postMessage({ action: 'BackgroundTimers::TickTimeout', timerID }), ms);
    postMessage({ action: uid, timerID });
}

function ClearTimeout(timerID: number): void {
    clearTimeout(timerID);
}

function SetInterval(uid: string, ms: number): void {
    const timerID = setInterval(() => postMessage({ action: 'BackgroundTimers::TickInterval', timerID }), ms);
    postMessage({ action: uid, timerID });
}

function ClearInterval(timerID: number): void {
    clearInterval(timerID);
}