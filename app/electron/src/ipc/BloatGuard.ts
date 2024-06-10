import type { WebContents } from 'electron';
import type { IPC } from './InterProcessCommunication';
import { BloatGuard as Channels } from '../../../src/ipc/Channels';

export class BloatGuard {

    constructor (private readonly ipc: IPC<Channels.Web, Channels.App>, private readonly webContents: WebContents) {
        this.ipc.Listen(Channels.App.Initialize, this.Initialize.bind(this));
    }

    private async Initialize(patterns: string[]): Promise<void> {
        this.webContents.session.webRequest.onBeforeRequest({ urls: patterns }, (_, callback) => callback({ cancel: true }));
    }
}