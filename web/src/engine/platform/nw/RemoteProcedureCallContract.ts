import type IPC from './InterProcessCommunication';
import type { IRemoteProcedureCallContract } from '../RemoteProcedureCallContract';
import { Channels } from '../../../../../app/nw/src/ipc/InterProcessCommunication';

export default class RemoteProcedureCallContract implements IRemoteProcedureCallContract {

    constructor (private readonly ipc: IPC) {
        this.ipc.Listen(Channels.RemoteProcedureCallContract.Web.LoadMediaContainerFromURL, this.LoadMediaContainerFromURL.bind(this));
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        try {
            globalThis.HakuNeko.PastedClipboardURL.Value = new URL(url);
        } catch(error) {
            console.warn(error);
        }
    }
}