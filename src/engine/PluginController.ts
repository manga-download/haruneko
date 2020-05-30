import SampleMangaProvider from './plugins/SampleManga'
import { IMediaContainer } from './plugins/MediaContainer';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    //private playground: IPlayground;
    private readonly _websites: IMediaContainer[] = [];

    constructor() {
        // TODO: register all website plugins ...
        this.RegisterWebsitePlugin(new SampleMangaProvider());
    }

    public RegisterWebsitePlugin(plugin: IMediaContainer) {
        this._websites.push(plugin);
    }

    public get WebsitePlugins() {
        return this._websites;
    }
}