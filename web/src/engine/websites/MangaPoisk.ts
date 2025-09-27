import { Tags } from '../Tags';
import icon from './MangaPoisk.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+/, 'header.card-header h1 span')
@Common.MangasMultiPageCSS('div.grid div.manga-card > a', Common.PatternLinkGenerator('/manga?page={page}'), 0, (element: HTMLAnchorElement) => ({ id: element.pathname, title: element.text.trim() }))
@Common.ChaptersMultiPageCSS('#page-content span.chapter-title', Common.PatternLinkGenerator('{id}?tab=chapters&page={page}'), 0,
    (span: HTMLSpanElement) => ({ id: span.closest('a').pathname, title: span.innerText.trim() }))
@Common.PagesSinglePageCSS('img[data-page]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapoisk', 'MangaPoisk', 'https://mangapoisk.io', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}