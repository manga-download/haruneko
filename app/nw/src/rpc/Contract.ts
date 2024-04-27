import type { RemoteContract } from 'websocket-rpc';
import type { PlatformIPC, TypeFromInterface } from '../../../../web/src/engine/platform/InterProcessCommunicationTypes';

// TODO: Maybe make Contract an interface and implement it in IPC,
//       because Contract just relays all calls anyway ...
export class Contract implements RemoteContract<Contract> {

    constructor(private readonly ipc: PlatformIPC) {}

    async SetCloudFlareBypass(userAgent: string, cookies: TypeFromInterface<chrome.cookies.Cookie>[]): Promise<void> {
        return this.ipc.SetCloudFlareBypass(userAgent, cookies);
    }

    async LoadMediaContainerFromURL(url: string): Promise<void> {
        return this.ipc.LoadMediaContainerFromURL(url);
    }
}