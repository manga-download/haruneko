import type { AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/platform/InterProcessCommunicationTypes';
import type { RPCServer } from '../rpc/Server';
import * as fs from 'node:fs/promises';

type IPCPayload<T> = {
    method: keyof T,
    parameters: JSONArray,
}

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    public RPC?: RPCServer;

    constructor() {
        chrome.runtime.onMessage.addListener(this.Listen.bind(this));
    }

    private async Send(method: keyof WebIPC, ...parameters: JSONArray): Promise<void> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active: true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        return new Promise<void>(resolve => {
            if(tab?.id) {
                //console.log(`App::IPC.Send::${method}`, parameters);
                chrome.tabs.sendMessage<IPCPayload<WebIPC>, void>(tab.id, { method, parameters }, resolve);
            } else {
                throw new Error(/* TODO: Message */);
            }
        });
    }

    private Listen(payload: IPCPayload<AppIPC>, sender: chrome.runtime.MessageSender, callback: (response: void) => void): boolean | void {
        //console.log('App::IPC.Received', payload, sender, callback);
        if(payload.method in this) {
            this[payload.method].call(this, ...payload.parameters).then(callback);
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
        // FIXME: navigator.userAgent in Background Script is Node.js/21 => https://github.com/nwjs/nw.js/issues/8162
        //console.log(`User-Agent Change (${userAgent !== navigator.userAgent})`, navigator.userAgent, '=>', userAgent);
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
        return this.Send('LoadMediaContainerFromURL', url);
    }
}