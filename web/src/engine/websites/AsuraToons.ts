import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AsuraToons.webp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol li:last-of-type span')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid div[data-testid="manga-card"] a:has(h3)', Common.PatternLinkGenerator('/browse?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h3[data-testid="manga-card-title"]').textContent.trim()
}))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div.grid div[data-testid="chapter-card"]')].map( el => ({ id: location.pathname+'/chapter/'+ el.dataset.chapterNumber, title: 'Chapter ' + el.dataset.chapterNumber}))`, 1500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div[data-slot="card-content"] img')].map( img => img.src)`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asuratoons', 'Asura Toons', 'https://www.asuratoons.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}