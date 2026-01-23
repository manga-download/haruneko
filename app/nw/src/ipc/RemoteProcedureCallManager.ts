import type { RPCServer } from '../../../src/rpc/Server';
import { type IPC, Channels } from './InterProcessCommunication';

/**
 * Administration of the underlying RPC server via NW specific IPC channels.
 */
export class RemoteProcedureCallManager {

    constructor (private readonly rpc: RPCServer, private readonly ipc: IPC) {
        this.ipc.Listen(Channels.RemoteProcedureCallManager.App.Stop, this.Stop.bind(this));
        this.ipc.Listen(Channels.RemoteProcedureCallManager.App.Restart, this.Restart.bind(this));
    }

    private async Stop(): Promise<void> {
        return this.rpc.Stop();
    }

    private async Restart(port: number, secret: string): Promise<void> {
        return this.rpc.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }
}