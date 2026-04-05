import type { RPCServer } from '../../../src/rpc/Server';
<<<<<<< HEAD
import { type IPC, Channels } from './InterProcessCommunication';
=======
import type { IPC, Callback } from './InterProcessCommunication';
import { RemoteProcedureCallManager as Channels } from '../../../src/ipc/Channels';
>>>>>>> master

/**
 * Administration of the underlying RPC server via NW specific IPC channels.
 */
export class RemoteProcedureCallManager {

<<<<<<< HEAD
    constructor (private readonly rpc: RPCServer, private readonly ipc: IPC) {
        this.ipc.Listen(Channels.RemoteProcedureCallManager.App.Stop, this.Stop.bind(this));
        this.ipc.Listen(Channels.RemoteProcedureCallManager.App.Restart, this.Restart.bind(this));
=======
    constructor(private readonly rpc: RPCServer, private readonly ipc: IPC<Channels.Web, Channels.App>) {
        this.ipc.Listen(Channels.App.Stop, this.Stop.bind(this));
        this.ipc.Listen(Channels.App.Restart, this.Restart.bind(this) as Callback);
>>>>>>> master
    }

    private async Stop(): Promise<void> {
        return this.rpc.Stop();
    }

    private async Restart(port: number, secret: string): Promise<void> {
        return this.rpc.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }
}