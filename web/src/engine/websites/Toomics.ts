import { Tags } from '../Tags';
import icon from './Toomics.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { ToomicsBase, WebsiteInfoExtractor } from './templates/ToomicsBase';

@Common.MangaCSS(/^{origin}\/[a-z]+\/webtoon\/episode\/toon\/\d+$/, 'section.ep-body a[data-toon-name]', WebsiteInfoExtractor())
export default class extends ToomicsBase {

    public constructor() {
        super('toomics', 'Toomics (Global)', 'https://global.toomics.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
        this.languages = ['en', 'es', 'de', 'fr', 'it', 'jp', 'mx', 'por', 'sc', 'tc'];
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}