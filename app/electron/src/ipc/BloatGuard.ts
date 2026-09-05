import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { Channels } from './InterProcessCommunicationChannels';

export class BloatGuard {

    constructor (private readonly ipc: IPC, private readonly webContents: WebContents) {
        this.ipc.Handle(Channels.BloatGuard.Initialize, this.Initialize.bind(this));
    }

    private async Initialize(patterns: string[]): Promise<void> {
        this.webContents.session.webRequest.onBeforeRequest({ urls: patterns }, (_, callback) => callback({ cancel: true }));
    }
}