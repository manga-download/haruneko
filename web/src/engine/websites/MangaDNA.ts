import { Tags } from '../Tags';
import icon from './MangaDNA.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('div.home-list div.home-item h3.htitle a', Common.PatternLinkGenerator('/manga/page/{page}'))
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a.chapter-name')
@Common.PagesSinglePageCSS('div.read-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadna', 'MangaDNA', 'https://mangadna.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}