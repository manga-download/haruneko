import { ipcMain } from 'electron';
import { RPCServer } from '../../../nw/src/rpc/Server';
import { Contract } from '../../../nw/src/rpc/Contract';
import type { PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/platform/InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    public RPC?: RPCServer;

    constructor() {
        this.RPC = new RPCServer('/hakuneko', new Contract(this));
        ipcMain.handle('StopRPC', () => this.StopRPC());
        ipcMain.handle('RestartRPC', (_, port: number, secret: string) => this.RestartRPC(port, secret));
        ipcMain.handle('SetCloudFlareBypass', (_, userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]) => this.SetCloudFlareBypass(userAgent, cookies));
    }

    /*
    private async Send<R extends IPCResponse>(method: keyof WebIPC, ...parameters: IPCParameters): Promise<R> {
        // TODO: improve query filter e.g., windowID or tabID
        const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => chrome.tabs.query({ active : true }, resolve));
        const tab = tabs.length > 0 ? tabs.shift() : undefined;
        return new Promise<R>(resolve => {
            if(tab?.id) {
                //console.log(`App::IPC.Send::${method}`, parameters);
                chrome.tabs.sendMessage<IPCPayload<WebIPC>, R>(tab.id, { method, parameters }, resolve);
            } else {
                throw new Error();
            }
        });
    }
    */

    public async StopRPC() {
        console.log('IPC::StopRPC()');
        //return this.RPC?.Stop();
    }

    public async RestartRPC(port: number, secret: string) {
        console.log('IPC::RestartRPC()', port, secret);
        //return this.RPC?.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        console.log('IPC::SetCloudFlareBypass()', userAgent, cookies);
        /*
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
        */
    }

    public async LoadMediaContainerFromURL(url: string) {
        console.log('IPC::LoadMediaContainerFromURL()', url);
        //this.win.webContents.send('LoadMediaContainerFromURL', url);
    }
}