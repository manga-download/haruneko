import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.manga-detail-title')
@Common.MangasMultiPageCSS('div.manga-card-info h3.manga-card-title a', Common.PatternLinkGenerator('./filterList?page={page}&sortBy=name'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.chapter-card-new', undefined, anchor => ({
    id: anchor.pathname,
    title: `Bölüm ${anchor.querySelector<HTMLDivElement>('div.chapter-num-badge').textContent.trim()}: ${anchor.querySelector<HTMLHeadingElement>('h4.chapter-card-title').textContent.trim()}`
}))
@Common.PagesSinglePageCSS('div#longstripMode img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadenizi', 'Manga Denizi', 'https://www.mangadenizi.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}