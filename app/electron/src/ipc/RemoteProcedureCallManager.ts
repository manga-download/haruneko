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
    Stop = 'RemoteProcedureCallManager::Stop()',
    Restart = 'RemoteProcedureCallManager::Restart(port: number, secret: string)',
};

/**
 * Administration of the underlying RPC server via Electron specific IPC channels.
 */
export class RemoteProcedureCallManager {

    constructor(private readonly rpc: RPCServer, private readonly ipc: IPC<RendererChannels, MainChannels>) {
        this.ipc.Listen(MainChannels.Stop, this.Stop.bind(this));
        this.ipc.Listen(MainChannels.Restart, this.Restart.bind(this));
    }

    private async Stop(): Promise<void> {
        return this.rpc.Stop();
    }

    private async Restart(port: number, secret: string): Promise<void> {
        return this.rpc.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }
}