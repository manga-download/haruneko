import { Tags } from '../Tags';
import icon from './Kairatoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/webtoon\/[^/]+$/, 'li.breadcrumb-current.truncate')
@Common.MangasSinglePageCSS('/katalog', 'div.catalog-list a.latest-release-card__title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div[data-testid="chapters-section"] a.surface', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.truncate').textContent.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('img.reader-page-img')].map(img => img.src);`, 750)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kairatoon', 'Kairatoon', 'https://kairatoon.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}