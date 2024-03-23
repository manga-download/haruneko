import type { SettingsManager } from '../../SettingsManager';
import type { PlatformIPC, TypeFromInterface } from '../InterProcessCommunication';

/**
 * Inter Process Communication for Electron (main process)
 */
export default class implements PlatformIPC {

    constructor(private readonly settingsManager: SettingsManager) {}

    public async StopRPC(): Promise<void> {
        console.log('Web::IPC::StopRPC()');
        return globalThis.ipcRenderer.invoke('StopRPC');
    }

    public async RestartRPC(port: number, secret: string): Promise<void> {
        console.log('Web::IPC::RestartRPC()', '=>', port, secret);
        return globalThis.ipcRenderer.invoke('RestartRPC', port, secret);
    }

    public async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        console.log('Web::IPC::SetCloudFlareBypass()', '=>', userAgent, cookies);
        // => Receive on Renderer
        throw new Error('Method not implemented.');
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        console.log('Web::IPC::LoadMediaContainerFromURL()', '=>', url);
        // => Receive on Renderer
        throw new Error('Method not implemented.');
    }
}