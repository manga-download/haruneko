import type { IBloatGuard } from '../BloatGuard';
import type { IPC } from '../InterProcessCommunication';
import { ApplicationWindow as Channels } from '../../../../../app/src/ipc/Channels';

export default class implements IBloatGuard {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, private readonly patterns: Array<string>) {}

    async Initialize(): Promise<void> {
        console.log('Platform::Electron::BloatGuard::Initialize()');
        this.ipc.Send(Channels.App., this.patterns);
        //throw new Error('Method not implemented.');
    }
}