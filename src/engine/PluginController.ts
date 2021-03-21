import { IMediaContainer } from './providers/MediaPlugin';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[] = [];

    constructor() {
        // TODO: register all website plugins ...
        this.RegisterWebsitePlugins();
    }

    public async RegisterWebsitePlugins(): Promise<void> {
        const plugin = await import('./websites/SheepManga');
        const scraper = new plugin.default();
        this._websites.push(scraper.CreatePlugin());
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}