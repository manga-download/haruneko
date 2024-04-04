import type { Numeric, Text, Check, SettingsManager } from '../../SettingsManager';
import { Key as GlobalKey } from '../../SettingsGlobal';
import type { IPCParameters, IPCPayload, IPCResponse, AppIPC, WebIPC, PlatformIPC, TypeFromInterface } from '../InterProcessCommunication';

/**
 * Inter Process Communication for NodeWebkit (content page)
 */
export default class implements PlatformIPC {

    constructor(private readonly settingsManager: SettingsManager) {
        chrome.runtime.onMessage.addListener(this.Listen.bind(this));
        const settings = settingsManager.OpenScope();
        settings.Get<Check>(GlobalKey.RPCEnabled).ValueChanged.Subscribe(this.UpdateRPC.bind(this));
        settings.Get<Numeric>(GlobalKey.RPCPort).ValueChanged.Subscribe(this.UpdateRPC.bind(this));
        settings.Get<Text>(GlobalKey.RPCSecret).ValueChanged.Subscribe(this.UpdateRPC.bind(this));
        this.UpdateRPC();
    }

    private async Send<R extends IPCResponse>(method: keyof AppIPC, ...parameters: IPCParameters): Promise<R> {
        //console.log(`Web::IPC.Send::${method}`, parameters);
        return new Promise<R>(resolve => chrome.runtime.sendMessage<IPCPayload<AppIPC>, R>({ method, parameters }, resolve));
    }

    private Listen(payload: IPCPayload<WebIPC>, sender: chrome.runtime.MessageSender, callback: (response: IPCResponse) => void): boolean | void {
        //console.log('Web::IPC.Received', payload, sender, callback);
        if(payload.method in this) {
            this[payload.method].call<AppIPC, IPCParameters, Promise<IPCResponse>>(this, ...payload.parameters).then(callback);
            return true;
        } else {
            //console.error('No IPC callback handler found for:', payload.method);
        }
    }

    private async UpdateRPC() {
        const settings = this.settingsManager.OpenScope();
        if(settings.Get<Check>(GlobalKey.RPCEnabled).Value) {
            const port = settings.Get<Numeric>(GlobalKey.RPCPort).Value;
            const secret = settings.Get<Text>(GlobalKey.RPCSecret).Value;
            await this.RestartRPC(port, secret);
        } else {
            this.StopRPC();
        }
    }

    public async StopRPC() {
        return this.Send<void>('StopRPC');
    }

    public async RestartRPC(port: number, secret: string) {
        return this.Send<void>('RestartRPC', port, secret);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        return this.Send<void>('SetCloudFlareBypass', userAgent, cookies);
    }

    public async LoadMediaContainerFromURL(url: string) {
        for(const website of HakuNeko.PluginController.WebsitePlugins) {
            const media = await website.TryGetEntry(url);
            if(media) {
                //console.log('LoadMediaContainerFromURL() => Found:', media);
                return;
            }
        }
        //console.log('LoadMediaContainerFromURL() => Found:', undefined);
    }
}