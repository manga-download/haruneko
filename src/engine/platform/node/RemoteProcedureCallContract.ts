import type { IRemoteProcedureCallContract } from '../RemoteProcedureCallContract';

/**
 * Stub RemoteProcedureCallContract for Node.js/Puppeteer
 * RPC/IPC is not needed in the API environment
 */
export default class RemoteProcedureCallContract implements IRemoteProcedureCallContract {
    async LoadMediaContainerFromURL(url: string): Promise<void> {
        // No-op for Node.js - Not using desktop app features
    }
}
