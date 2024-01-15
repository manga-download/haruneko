import { Tags } from '../Tags';
import icon from './AssortedScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/reader\/[^/]+\/$/, '#series-title')
@Common.MangasSinglePageCSS('/reader/', 'section.series h2.series-title a')
@Common.ChaptersSinglePageCSS('div.chapter > a')
@Common.ImageAjaxFromHTML('#page-image', false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('assortedscans', `Assorted Scans`, 'https://assortedscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier+'1/', this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li.dropdown-element.page-details a');
        return data.map(page => new Page(this, chapter, new URL(page.pathname, this.URI)));
    }
}