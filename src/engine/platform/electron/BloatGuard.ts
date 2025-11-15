import type { IBloatGuard } from '../BloatGuard';
import type { IPC } from '../InterProcessCommunication';
import { BloatGuard as Channels } from '../../../ipc/Channels';

export default class implements IBloatGuard {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>, private readonly patterns: Array<string>) {}

    async Initialize(): Promise<void> {
        return this.ipc.Send(Channels.App.Initialize, this.patterns);
    }
}