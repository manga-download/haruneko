import { Tags } from '../Tags';
import icon from './Lalatoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Toomics from './decorators/Toomics';
import { FetchWindowScript } from '../platform/FetchProvider';

@Toomics.MangaCSS(/^{origin}\/[a-z]+\/webtoon\/episode\/toon\/\d+$/)
@Toomics.MangasSinglePageCSS(['kr', 'en', 'es', 'de', 'fr', 'it', 'jp', 'mx', 'por', 'sc', 'tc'])
@Toomics.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(Toomics.queryPages, Toomics.PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lalatoon', `Lalatoon`, 'https://www.lalatoon.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}