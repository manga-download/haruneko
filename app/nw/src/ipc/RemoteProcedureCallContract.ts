import * as fs from 'node:fs/promises';
import type { Contract } from '../../../src/rpc/Contract';
import { type IPC, Channels } from './InterProcessCommunication';

export class RemoteProcedureCallContract implements Contract {

    constructor (private readonly ipc: IPC) { }

    public async SetCloudFlareBypass(userAgent: string, cookies: chrome.cookies.Cookie[]): Promise<void> {
        for(const cookie of cookies) {
            try {
                await chrome.cookies.set({
                    domain: cookie.domain,
                    name: cookie.name,
                    partitionKey: cookie.partitionKey,
                    url: `https://${ cookie.domain.replace(/^\./, '') }${ cookie.path }`,
                    //storeId: cookie.storeId,
                    value: cookie.value,
                    // Enforce 1 month expiration to persist cookie after application restart
                    expirationDate: Math.round(Date.now() / 1000 + 2628000), // cookie.expirationDate
                    path: cookie.path,
                    httpOnly: cookie.httpOnly,
                    secure: cookie.secure,
                    sameSite: cookie.sameSite,
                });
            } catch(error) {
                console.warn('Failed to set cookie:', cookie, error);
            }
        }
        // WORKAROUND: Use `manifest.userAgent` due to bug where `navigator.userAgent` in Background Script is `Node.js/21` => https://github.com/nwjs/nw.js/issues/8162
        if(userAgent !== nw.App.manifest['user-agent'] /* navigator.userAgent */) {
            const file = 'package.json';
            const manifest = JSON.parse(await fs.readFile(file, 'utf-8'));
            manifest['user-agent'] = userAgent;
            await fs.writeFile(file, JSON.stringify(manifest, null, 2), 'utf-8');
            alert('[I18N] User-Agent ID for CloudFlare Bypass updated, please restart the application to take effect.');
        }
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        return this.ipc.Send(Channels.RemoteProcedureCallContract.Web.LoadMediaContainerFromURL, url);
    }
}