import type { RPCServer } from '../../../src/rpc/Server';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with the RPC manager.
 * @description Send from the Main process and received in the Render process.
 */
export type RendererChannels = never;

/**
 * Supported IPC Channels for interacting with the RPC manager.
 * @description Send from the Render process and received in the Main process.
 */
export enum MainChannels {
    Stop = 'RPC-Manager::Stop',
    Restart = 'RPC-Manager::Restart',
};

/**
 * Administration of the underlying RPC server via Electron specific IPC channels.
 */
export class RemoteProcedureCallManager {

    constructor(public readonly RPC: RPCServer, private readonly ipc: IPC<RendererChannels, MainChannels>) {
        this.ipc.Listen(MainChannels.Stop, this.Stop.bind(this));
        this.ipc.Listen(MainChannels.Restart, this.Restart.bind(this));
    }

    public async Stop() {
        return this.RPC.Stop();
    }

    public async Restart(port: number, secret: string) {
        return this.RPC.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }
}