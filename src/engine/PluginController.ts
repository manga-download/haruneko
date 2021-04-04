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
        this._websites.push(new (await import('./websites/Hiperdex')).default().CreatePlugin());
        this._websites.push(new (await import('./websites/Leitor')).default().CreatePlugin());
        this._websites.push(new (await import('./websites/Toonily')).default().CreatePlugin());
        this._websites.push(new (await import('./websites/SheepManga')).default().CreatePlugin());
        window.dispatchEvent(new Event('plugins-loaded'));
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}