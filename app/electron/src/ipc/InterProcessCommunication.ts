import { ipcMain } from 'electron';
import { RPCServer } from '../../../nw/src/rpc/Server';
import { Contract } from '../../../nw/src/rpc/Contract';
import type { WebIPC, PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/platform/InterProcessCommunicationTypes';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    public RPC?: RPCServer;

    constructor(private readonly renderer: Electron.WebContents) {
        this.RPC = new RPCServer('/hakuneko', new Contract(this));
        ipcMain.handle('StopRPC', () => this.StopRPC());
        ipcMain.handle('RestartRPC', (_, port: number, secret: string) => this.RestartRPC(port, secret));
        ipcMain.handle('SetCloudFlareBypass', (_, userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]) => this.SetCloudFlareBypass(userAgent, cookies));
    }

    private async Send(method: keyof WebIPC, ...parameters: JSONArray): Promise<void> {
        this.renderer.send(method, ...parameters);
    }

    public async StopRPC() {
        console.log('App::IPC::StopRPC()');
        return this.RPC?.Stop();
    }

    public async RestartRPC(port: number, secret: string) {
        console.log('App::IPC::RestartRPC()', port, secret);
        return this.RPC?.Listen(port, secret, [ /^(chrome-)?extension:/i ]);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        console.log('App::IPC::SetCloudFlareBypass()', userAgent, cookies);
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
        console.log('App::IPC::LoadMediaContainerFromURL()', url);
        this.Send('LoadMediaContainerFromURL', url);
    }
}