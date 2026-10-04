import { Tags } from '../Tags';
import icon from './LumosKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLTitleElement>(/^{origin}\/comic\/[^/]+$/, 'title', (title, uri) => ({
    id: uri.pathname,
    title: title.text.split('|').at(0).trim()
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#browse-grid-view div.grid a[data-astro-prefetch]:has(img)', Common.PatternLinkGenerator('/browse?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a[data-chapter]', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span').textContent.trim()
}))
@Common.PagesSinglePageCSS('div#reader-pages img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lumoskomik', 'LumosKomik', 'https://03.lumosgg.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}