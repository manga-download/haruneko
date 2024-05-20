import path from 'node:path';
import fs from 'node:fs/promises';
import { app, session, type WebContents } from 'electron';
import type { Contract } from '../../../src/rpc/Contract';
import type { IPC } from './InterProcessCommunication';

/**
 * Supported IPC Channels for interacting with the RPC contract callbacks.
 * @description Send from the Main process and received in the Render process.
 */
export enum RendererChannels {
    LoadMediaContainerFromURL = 'RPC-Contract::LoadMediaContainerFromURL',
};

/**
 * Supported IPC Channels for interacting with the RPC contract callbacks.
 * @description Send from the Render process and received in the Main process.
 */
export type MainChannels = never;

export class RemoteProcedureCallContract implements Contract {

    constructor(private readonly ipc: IPC<RendererChannels, MainChannels>, private readonly webContents: WebContents) {}

    public async SetCloudFlareBypass(userAgent: string, cookies: chrome.cookies.Cookie[]): Promise<void> {
        if(userAgent !== this.webContents.getUserAgent()) {
            const file = path.resolve(app.getAppPath(), 'package.json');
            const manifest = JSON.parse(await fs.readFile(file, 'utf-8'));
            manifest['user-agent'] = userAgent;
            await fs.writeFile(file, JSON.stringify(manifest, null, 2), 'utf-8');
            this.webContents.setUserAgent(userAgent);
        }

        for(const cookie of cookies) {
            await session.defaultSession.cookies.set({
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
    }

    public async LoadMediaContainerFromURL(url: string) {
        return this.ipc.Send(RendererChannels.LoadMediaContainerFromURL, url);
    }
}