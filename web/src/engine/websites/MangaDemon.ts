import { Tags } from '../Tags';
import icon from './MangaDemon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.novel-title')
@Common.MangasMultiPageCSS('/browse.php?list={page}', 'h2.novel-title a')
@Common.ChaptersSinglePageCSS('ul.chapter-list li a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('img.imgholder')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangademon', 'MangaDemon', 'https://mgdemon.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}