import { ipcMain } from 'electron';
import { RPCServer } from '../../../nw/src/rpc/Server';
import { Contract } from '../../../nw/src/rpc/Contract';
import type { AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/platform/InterProcessCommunicationTypes';

/**
 * Inter Process Communication for NodeWebkit (background page)
 */
export class IPC implements PlatformIPC {

    public RPC?: RPCServer;

    constructor(private readonly webContents: Electron.WebContents) {
        this.RPC = new RPCServer('/hakuneko', new Contract(this));
        this.Listen('StopRPC');
        this.Listen('RestartRPC');
        this.Listen('SetCloudFlareBypass');
    }

    private async Send(method: keyof WebIPC, ...parameters: JSONArray): Promise<void> {
        this.webContents.send(method, ...parameters);
    }

    private Listen(method: keyof AppIPC) {
        ipcMain.handle(method, (_, ...args: JSONArray) => this[method]?.call(this, ...args));
    }

    public async StopRPC() {
        return this.RPC?.Stop();
    }

    public async RestartRPC(port: number, secret: string) {
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
        this.Send('LoadMediaContainerFromURL', url);
    }
}