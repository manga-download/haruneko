import type { IPCParameters, IPCPayload, IPCResponse, AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/ipc/InterProcessCommunication';
import type { RPCServer } from '../rpc/Server';
import * as fs from 'node:fs/promises';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    public RPC?: RPCServer;

    constructor() {
        chrome.runtime.onMessage.addListener(this.Listen.bind(this));
    }

    private async Send<R extends IPCResponse>(method: keyof WebIPC, ...parameters: IPCParameters): Promise<R> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active : true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        return new Promise<R>(resolve => {
            if(tab?.id) {
                //console.log(`App::IPC.Send::${method}`, parameters);
                chrome.tabs.sendMessage<IPCPayload<WebIPC>, R>(tab.id, { method, parameters }, resolve);
            } else {
                throw new Error(/* TODO: Message */);
            }
        });
    }

    private Listen(payload: IPCPayload<AppIPC>, sender: chrome.runtime.MessageSender, callback: (response: IPCResponse) => void): boolean | void {
        //console.log('App::IPC.Received', payload, sender, callback);
        if(payload.method in this) {
            this[payload.method].call<WebIPC, IPCParameters, Promise<IPCResponse>>(this, ...payload.parameters).then(callback);
            return true;
        } else {
            console.error('No IPC callback handler found for:', payload.method);
        }
    }

    public async StopRPC() {
        return this.RPC?.Stop();
    }

    public async RestartRPC(port: number, secret: string) {
        return this.RPC?.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
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

        if(userAgent !== navigator.userAgent) {
            // TODO: Is it safe to assume this is always correct manifest path?
            const file = 'package.json';
            const manifest = JSON.parse(await fs.readFile(file, 'utf-8'));
            manifest['user-agent'] = userAgent;
            await fs.writeFile(file, JSON.stringify(manifest, null, 2), 'utf-8');
            // TODO: This will not work in development mode, because a restart means a new generated package.json file
            // Show 'Restart Application' message
            alert('[I18N] User-Agent ID for CloudFlare Bypass updated, please restart the application to take effect.');
        }
    }

    public async LoadMediaContainerFromURL(url: string) {
        return this.Send<void>('LoadMediaContainerFromURL', url);
    }
}