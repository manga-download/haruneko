import * as fs from 'node:fs/promises';
import type { Contract } from '../../../src/rpc/Contract';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with the RPC contract callbacks.
 * @description Send from the Background script and received in the Content script.
 */
export enum ContentChannels {
    LoadMediaContainerFromURL = 'RemoteProcedureCallContract::LoadMediaContainerFromURL(url: string)',
};

/**
 * Supported IPC Channels for interacting with the RPC contract callbacks.
 * @description Send from the Content script and received in the Background script.
 */
export type BackgroundChannels = never;

export class RemoteProcedureCallContract implements Contract {

    constructor(private readonly ipc: IPC<ContentChannels, BackgroundChannels>) {}

    public async SetCloudFlareBypass(userAgent: string, cookies: chrome.cookies.Cookie[]): Promise<void> {
        for(const cookie of cookies) {
            await chrome.cookies.set({
                domain: cookie.domain,
                path: cookie.path,
                url: `https://${ cookie.domain.replace(/^\./, '') }${ cookie.path }`,
                name: cookie.name,
                value: cookie.value,
                expirationDate: cookie.expirationDate,
                httpOnly: cookie.httpOnly,
                secure: cookie.secure,
                sameSite: cookie.sameSite,
                //storeId: cookie.storeId,
            });
        }

        // FIXME: navigator.userAgent in Background Script is Node.js/21 => https://github.com/nwjs/nw.js/issues/8162
        if(userAgent !== navigator.userAgent) {
            const file = 'package.json';
            const manifest = JSON.parse(await fs.readFile(file, 'utf-8'));
            manifest['user-agent'] = userAgent;
            await fs.writeFile(file, JSON.stringify(manifest, null, 2), 'utf-8');
            alert('[I18N] User-Agent ID for CloudFlare Bypass updated, please restart the application to take effect.');
        }
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        return this.ipc.Send(ContentChannels.LoadMediaContainerFromURL, url);
    }
}