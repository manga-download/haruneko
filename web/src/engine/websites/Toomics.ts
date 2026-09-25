import { Tags } from '../Tags';
import icon from './Toomics.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { ToomicsBase } from './templates/ToomicsBase';

export default class extends ToomicsBase {

    public constructor() {
        super('toomics', 'Toomics (Global)', 'https://global.toomics.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetLanguages(['en', 'esp', 'de', 'fr', 'it', 'ja', 'por', 'sc', 'tc', 'th']);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}