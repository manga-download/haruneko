import { IMediaContainer } from './providers/MediaPlugin';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[] = [];

    constructor() {
        this.RegisterWebsitePlugins();
    }

    public async RegisterWebsitePlugins(): Promise<void> {
        // TODO: find better solution to bundle dynamic imports with rollup
        this._websites.push(new (await import('./websites/Leitor')).default().CreatePlugin());
        this._websites.push(new (await import('./websites/SheepManga')).default().CreatePlugin());
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}