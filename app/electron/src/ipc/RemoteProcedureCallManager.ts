import type { RPCServer } from '../../../src/rpc/Server';
import type { IPC } from './InterProcessCommunication';
import { RemoteProcedureCallManager as Channels } from '../../../src/ipc/Channels';

/**
 * Administration of the underlying RPC server via Electron specific IPC channels.
 */
export class RemoteProcedureCallManager {

    constructor(private readonly rpc: RPCServer, private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.Stop, this.Stop.bind(this));
        this.ipc.Listen(Channels.App.Restart, this.Restart.bind(this));
    }

    private async Stop(): Promise<void> {
        return this.rpc.Stop();
    }

    private async Restart(port: number, secret: string): Promise<void> {
        return this.rpc.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }
}