import { Tags } from '../Tags';
import icon from './Okutoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'h1.series-detail-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.series-card', Common.PatternLinkGenerator('/tur?sayfa={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.series-card-title').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.chapter-item', undefined, element => ({
    id: element.querySelector('a').pathname,
    title: element.querySelector('.chapter-title').textContent.trim()
}))
@Common.PagesSinglePageCSS<HTMLImageElement>('div.reader-page-frame img', image => image.dataset.original ?? image.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('okutoon', 'Okutoon', 'https://okutoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}