import { Tags } from '../../Tags';
import icon from './AssortedScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

@Common.MangaCSS(/^https?:\/\/assortedscans\.com\/reader\/[^/]+\/$/, '#series-title')
@Common.MangasSinglePageCSS('/reader/', 'section.series h2.series-title a')
@Common.ChaptersSinglePageCSS('div.chapter > a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('assortedscans', `Assorted Scans`, 'https://assortedscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new FetchRequest(new URL(chapter.Identifier+'1/', this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li.dropdown-element.page-details a');
        const pages: Page[] = [];
        for (const pagelink of data) {
            request = new FetchRequest(new URL(pagelink.pathname, this.URI).href);
            const img = await FetchCSS<HTMLImageElement>(request, '#page-image');
            pages.push(new Page(this, chapter, new URL(img[0].src)));
        }
        return pages;

    }
}