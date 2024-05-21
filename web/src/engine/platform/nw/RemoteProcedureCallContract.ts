import type { IPC } from '../InterProcessCommunication';
import type { IRemoteProcedureCallContract } from '../RemoteProcedureCallContract';
import { RemoteProcedureCallContract as Channels } from '../../../../../app/src/ipc/Channels';

export default class RemoteProcedureCallContract implements IRemoteProcedureCallContract {

    constructor(private readonly ipc: IPC<Channels.App, Channels.Web>) {
        this.ipc.Listen(Channels.Web.LoadMediaContainerFromURL, this.LoadMediaContainerFromURL.bind(this));
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