import type { IBloatGuard } from '../BloatGuard';

/**
 * Stub BloatGuard implementation for Node.js/Puppeteer
 * Ad-blocking and content filtering is handled by Puppeteer's request interception
 */
export default class BloatGuard implements IBloatGuard {
    async Initialize(): Promise<void> {
        // No-op for Node.js - Puppeteer handles content blocking
    }
}
