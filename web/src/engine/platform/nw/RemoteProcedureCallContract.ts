import type { IPC } from './InterProcessCommunication';
import { ContentChannels } from '../../../../../app/nw/src/ipc/RemoteProcedureCallContract';

export default class RemoteProcedureCallContract {

    constructor(private readonly ipc: IPC<never, ContentChannels>) {
        this.ipc.Listen(ContentChannels.LoadMediaContainerFromURL, this.LoadMediaContainerFromURL.bind(this))
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        console.log(ContentChannels.LoadMediaContainerFromURL, '=>', url);
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