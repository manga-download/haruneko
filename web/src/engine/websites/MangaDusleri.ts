import { Tags } from '../Tags';
import icon from './MangaDusleri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.manga-title-big', (element, uri) => ({
    id: uri.pathname,
    title: element.textContent.replace(/Türkçe Oku/i, '').trim()
}))
@Common.MangasMultiPageCSS('div.recent-card-body > a', Common.PatternLinkGenerator('/latest.php?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapterList a.chapter-grid-item-new', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div span').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.manga-images div.reader-image-wrap img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadusleri', 'MangaDusleri', 'https://mangadusleri.mom', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}