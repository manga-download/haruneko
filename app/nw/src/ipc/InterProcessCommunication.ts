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
                console.log(`App::IPC.Send::${method}`, parameters);
                chrome.tabs.sendMessage<IPCPayload<WebIPC>, R>(tab.id, { method, parameters }, resolve);
            } else {
                throw new Error(/* TODO: Message */);
            }
        });
    }

    private Listen(payload: IPCPayload<AppIPC>, sender: chrome.runtime.MessageSender, callback: (response: IPCResponse) => void): boolean | void {
        console.log('App::IPC.Received', payload, sender, callback);
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
        // TODO: Update default user-agent?
        // Seems only way to globally set UserAgent (all tabs, navigator.userAgent, request headers) is by command line => restart required
        // - navigator.userAgent
        // - navigator.appVersion
        // - User-Agent request header
        // - Client Hint request headers (optional)
        // Another approach would be network conitions, but this is per tab only
        // => chrome.debugger.

        for(const cookie of cookies) {
            await chrome.cookies.set({ ...cookie, url: `https://${cookie.domain}${cookie.path}` });
        }

        if(userAgent !== navigator.userAgent) {
            type Manifest = {
                'user-agent'?: string;
            }
            (nw.App.manifest as Manifest)['user-agent'] = userAgent;
            // TODO: Is it possible to read a relative path in bundled NW application?
            await fs.writeFile('package.json', JSON.stringify(nw.App.manifest, null, 2), 'utf-8');
            // Show restart application message
        }

        /*
        nw.Window.open('https://test.cloudscraper.ovh/managed', {
            'user-agent': userAgent
        } as NWJS_Helpers.WindowOpenOption);
        */
    }

    public async LoadMediaContainerFromURL(url: string) {
        //alert('LoadMediaContainerFromURL\n\n' + url);
        //console.log('LoadMediaContainerFromURL', '=>', url);
        return this.Send<void>('LoadMediaContainerFromURL', url);
    }
}