import { Tags } from '../Tags';
import icon from './Lalatoon.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { ToomicsBase } from './templates/ToomicsBase';

export default class extends ToomicsBase {
    public constructor() {
        super('lalatoon', 'Lalatoon', 'https://global.lalatoon.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetLanguages(['en', 'es', 'de', 'fr', 'it', 'jp', 'mx', 'por', 'sc', 'tc']);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}