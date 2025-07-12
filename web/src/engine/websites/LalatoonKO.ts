import { Tags } from '../Tags';
import icon from './Lalatoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Toomics from './decorators/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Toomics.MangaCSS(/^{origin}\/kr\/webtoon\/episode\/toon\/\d+$/, 'h3[class*="episode-top__tit"]', false)
@Toomics.MangasSinglePageCSS(['kr'], 'a[href*="/webtoon/episode/toon/"]', undefined, false)
@Toomics.ChaptersSinglePageCSS('ul.ep__list li a')
@Common.PagesSinglePageCSS(Toomics.queryPages, Toomics.PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('lalatoonko', `Lalatoon (KO)`, 'https://www.lalatoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}