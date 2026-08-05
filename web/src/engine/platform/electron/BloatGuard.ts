import type { IBloatGuard } from '../BloatGuard';
import { GetIPC } from './InterProcessCommunication';
import { Channels } from '../../../../../app/electron/src/ipc/InterProcessCommunicationChannels';

export default class implements IBloatGuard {

    private readonly ipc = GetIPC();

    constructor (private readonly patterns: Array<string>) { }

    async Initialize(): Promise<void> {
        return this.ipc.Invoke(Channels.BloatGuard.Initialize, this.patterns);
    }
}