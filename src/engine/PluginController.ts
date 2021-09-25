import { IMediaContainer } from './providers/MediaPlugin';
import * as websites from './websites/_index';

export interface IPluginController {
    WebsitePlugins: IMediaContainer[];
}

export class PluginController implements IPluginController {

    private readonly _websites: IMediaContainer[];

    constructor() {
        this._websites = Object.values(websites).map(website => new website().CreatePlugin() as IMediaContainer);
    }

    public get WebsitePlugins(): IMediaContainer[] {
        return this._websites;
    }
}