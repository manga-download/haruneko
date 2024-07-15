import * as fs from 'node:fs/promises';
import type { Contract } from '../../../src/rpc/Contract';
import type { IPC } from './InterProcessCommunication';
import { RemoteProcedureCallContract as Channels } from '../../../src/ipc/Channels';

export class RemoteProcedureCallContract implements Contract {

    constructor(private readonly ipc: IPC<Channels.Web, Channels.App>) {}

    public async SetCloudFlareBypass(userAgent: string, cookies: chrome.cookies.Cookie[]): Promise<void> {
        for(const cookie of cookies) {
            await chrome.cookies.set({
                domain: cookie.domain,
                path: cookie.path,
                url: `https://${ cookie.domain.replace(/^\./, '') }${ cookie.path }`,
                name: cookie.name,
                value: cookie.value,
                // Enforce 1 month expiration to persist cookie after application restart
                expirationDate: Math.round(Date.now() / 1000 + 2628000), // cookie.expirationDate
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
        return this.ipc.Send(Channels.Web.LoadMediaContainerFromURL, url);
    }
}