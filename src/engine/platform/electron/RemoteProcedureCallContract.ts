import type { IPC } from '../InterProcessCommunication';
import type { IRemoteProcedureCallContract } from '../RemoteProcedureCallContract';
import { RemoteProcedureCallContract as Channels } from '../../../../../app/src/ipc/Channels';

export default class RemoteProcedureCallContract implements IRemoteProcedureCallContract {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>) {
        this.ipc.Listen(Channels.Web.LoadMediaContainerFromURL, this.LoadMediaContainerFromURL.bind(this));
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        try {
            globalThis.HakuNeko.PastedClipboardURL.Value = new URL(url);
        } catch(error) {
            console.warn(error);
        }
    }
}