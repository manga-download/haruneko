import { Key as GlobalKey } from '../../SettingsGlobal';
import type { Numeric, Text, Check, SettingsManager } from '../../SettingsManager';
import type { AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../InterProcessCommunicationTypes';

/**
 * Inter Process Communication for Electron (main process)
 */
export default class implements PlatformIPC {

    private readonly rpcEnabled: Check;
    private readonly rpcPort: Numeric;
    private readonly rpcSecret: Text;

    constructor(settingsManager: SettingsManager) {
        this.Listen('LoadMediaContainerFromURL');

        const settings = settingsManager.OpenScope();
        this.rpcEnabled = settings.Get<Check>(GlobalKey.RPCEnabled);
        this.rpcPort = settings.Get<Numeric>(GlobalKey.RPCPort);
        this.rpcSecret = settings.Get<Text>(GlobalKey.RPCSecret);

        const callback = this.UpdateRPC.bind(this);
        this.rpcEnabled.Subscribe(callback);
        this.rpcPort.Subscribe(callback);
        this.rpcSecret.Subscribe(callback);

        this.UpdateRPC();
    }

    private async Send(method: keyof AppIPC, ...parameters: JSONArray): Promise<void> {
        return globalThis.ipcRenderer.invoke(method, ...parameters);
    }

    private Listen(method: keyof WebIPC) {
        globalThis.ipcRenderer.on(method, (_, ...args: JSONArray) => this[method]?.call(this, ...args));
    }

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
}