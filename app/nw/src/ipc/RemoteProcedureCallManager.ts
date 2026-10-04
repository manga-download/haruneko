import type { RPCServer } from '../../../src/rpc/Server';
import { type IPC, Channels } from './InterProcessCommunication';

/**
 * Administration of the underlying RPC server via NW specific IPC channels.
 */
export class RemoteProcedureCallManager {

    constructor (private readonly rpc: RPCServer, private readonly ipc: IPC) {
        this.ipc.Handle(Channels.RemoteProcedureCallManager.Stop, this.Stop.bind(this));
        this.ipc.Handle(Channels.RemoteProcedureCallManager.Restart, this.Restart.bind(this));
    }

    private async Stop(): Promise<void> {
        //console.log('App::RemoteProcedureCallManager::Stop()');
        this.rpc.Stop();
    }

    private async Restart(port: number, secret: string): Promise<void> {
        //console.log('App::RemoteProcedureCallManager::Restart()', port, secret);
        await this.rpc.Listen(port, secret, [/^(chrome-)?extension:/i]);
    }
}