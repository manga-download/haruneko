import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './EternalMangas.webp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.em-series-catalog-card', Common.PatternLinkGenerator('/series?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.em-series-catalog-title').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.em-chapter-row a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div div.text-truncate').textContent.trim()
}))
@Common.PagesSinglePageCSS('div#em-reader-pages img.em-reader-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.org', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}