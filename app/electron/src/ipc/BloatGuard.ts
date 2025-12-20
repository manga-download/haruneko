import type { WebContents } from 'electron';
import { type IPC, Channels } from './InterProcessCommunication';

export class BloatGuard {

    constructor (private readonly ipc: IPC, private readonly webContents: WebContents) {
        this.ipc.Listen(Channels.BloatGuard.App.Initialize, this.Initialize.bind(this));
    }

    private async Initialize(patterns: string[]): Promise<void> {
        this.webContents.session.webRequest.onBeforeRequest({ urls: patterns }, (_, callback) => callback({ cancel: true }));
    }
}