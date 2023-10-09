import { Tags } from '../Tags';
import icon from './AssortedScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeProxify from '../transformers/ImageLinkDeProxifier';

@Common.MangaCSS(/^https?:\/\/assortedscans\.com\/reader\/[^/]+\/$/, '#series-title')
@Common.MangasSinglePageCSS('/reader/', 'section.series h2.series-title a')
@Common.ChaptersSinglePageCSS('div.chapter > a')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('assortedscans', `Assorted Scans`, 'https://assortedscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier+'1/', this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'li.dropdown-element.page-details a');
        return data.map(page => new Page(this, chapter, new URL(page.pathname, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const fakechapter = new Chapter(this, page.Parent.Parent as Manga, page.Link.href, '');
        const image = (await Common.FetchPagesSinglePageCSS.call(this, fakechapter, '#page-image'))[0];
        image.Link.href = DeProxify(image.Link).href;
        return await Common.FetchImageAjax.call(this, image, priority, signal, false);
    }
}