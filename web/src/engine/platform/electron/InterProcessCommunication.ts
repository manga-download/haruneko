import { Key as GlobalKey } from '../../SettingsGlobal';
import type { Numeric, Text, Check, SettingsManager } from '../../SettingsManager';
import type { AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../nw/InterProcessCommunicationTypes';

export class IPC<TSend extends string, TListen extends string> {

    public async Send(method: TSend, ...parameters: JSONArray): Promise<void> {
        return globalThis.ipcRenderer.invoke(method, ...parameters);
    }

    public Listen(method: TListen, callback: (...args: JSONArray) => Promise<void>) {
        globalThis.ipcRenderer.on(method, (_, ...args: JSONArray) => callback.call(callback, ...args));
    }

    /*
    private async UpdateRPC(): Promise<void> {
        return this.rpcEnabled.Value ? this.RestartRPC(this.rpcPort.Value, this.rpcSecret.Value) : this.StopRPC();
    }

    public async StopRPC(): Promise<void> {
        return this.Send('StopRPC');
    }

    public async RestartRPC(port: number, secret: string): Promise<void> {
        return this.Send('RestartRPC', port, secret);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        return this.Send('SetCloudFlareBypass', userAgent, cookies);
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        for(const website of globalThis.HakuNeko.PluginController.WebsitePlugins) {
            const media = await website.TryGetEntry(url);
            if(media) {
                console.log('LoadMediaContainerFromURL() => Match Found:', media);
                return;
            }
        }
        console.log('LoadMediaContainerFromURL() => No Match Found:', url);
    }
    */
}