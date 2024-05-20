import type { IPC } from './InterProcessCommunication';
import { RendererChannels } from '../../../../../app/electron/src/ipc/RemoteProcedureCallContract';

export default class RemoteProcedureCallContract {

    constructor(private readonly ipc: IPC<never, RendererChannels>) {
        this.ipc.Listen(RendererChannels.LoadMediaContainerFromURL, this.LoadMediaContainerFromURL.bind(this))
    }

    public async LoadMediaContainerFromURL(url: string): Promise<void> {
        console.log(RendererChannels.LoadMediaContainerFromURL, '=>', url);
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