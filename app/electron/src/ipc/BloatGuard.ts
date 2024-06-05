import type { IPC } from './InterProcessCommunication';
import { BloadGuard as Channels } from '../../../src/ipc/Channels';

export class BloadGuard {

    constructor (private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.Initialize, this.Initialize.bind(this));
    }

    private async Initialize(patterns: string[]): Promise<void> {
        console.log('BloadGuard::Initialize', '=>', patterns);
    }
}