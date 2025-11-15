import type { IRemoteProcedureCallManager } from '../RemoteProcedureCallManager';

/**
 * Stub RemoteProcedureCallManager for Node.js/Puppeteer
 * RPC/IPC is not needed in the API environment
 */
export default class RemoteProcedureCallManager implements IRemoteProcedureCallManager {
    async Stop(): Promise<void> {
        // No-op for Node.js
    }

    async Restart(port: number, secret: string): Promise<void> {
        // No-op for Node.js
    }
}
