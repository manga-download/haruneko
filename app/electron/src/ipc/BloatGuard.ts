import path from 'node:path';
import { app, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { argvPreloadScript } from './RemoteBrowserWindowPreload';
import type { IPC } from './InterProcessCommunication';
import { BloadGuard as Channels } from '../../../src/ipc/Channels';

export class BloadGuard {

    constructor (private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.Initialize, this.OpenWindow.bind(this));
    }

    private Throw<T>(message: string): T {
        throw new Error(message);
    }

    private async (windowID: number): Promise<void> {
        //this.FindWindow(windowID).destroy();
    }
}