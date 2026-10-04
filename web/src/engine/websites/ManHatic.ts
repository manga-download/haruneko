import { Tags } from '../Tags';
import icon from './ManHatic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.h-hero')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('#main div.grid a', Common.PatternLinkGenerator('/library?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h3').textContent.trim()
}))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('#series-panel-chapters a.group')].map(e=> ({ id: e.pathname, title: e.querySelector('span span').textContent.trim()}));`, 500)
@Common.PagesSinglePageCSS('div.reader-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhatic', 'HentaiLek', 'https://hentailek.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Arabic, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}