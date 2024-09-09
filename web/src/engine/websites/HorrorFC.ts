import { Tags } from '../Tags';
import icon from './HorrorFC.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.page-title')
@Common.MangasSinglePageCSS('', 'div.posts ul.row li a')
@Common.ChaptersSinglePageCSS('header.page-header h2 a[rel="bookmark"]')
@Common.PagesSinglePageCSS('section.entry-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('horrorfc', 'HorrorFC', 'https://horrorfc.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}