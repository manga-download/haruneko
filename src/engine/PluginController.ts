import DynastyScans from './websites/DynastyScans';
import SampleMangaProvider from './websites/SampleManga';
import { IMediaContainer } from './MediaContainer';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[] = [];

    constructor() {
        // TODO: register all website plugins ...
        this.RegisterWebsitePlugin(new DynastyScans());
        this.RegisterWebsitePlugin(new SampleMangaProvider());
    }

    public RegisterWebsitePlugin(plugin: IMediaContainer): void {
        this._websites.push(plugin);
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}