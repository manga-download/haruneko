import { Tags } from '../Tags';
import icon from './AssortedScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
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
        const image = await this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal
            });
            const realimage = (await FetchCSS<HTMLImageElement>(request, '#page-image'))[0].src;
            return new Page(this, page.Parent as Chapter, new URL(DeProxify(new URL(realimage, this.URI)).href));
        }, priority, signal);

        return await Common.FetchImageAjax.call(this, image, priority, signal, false);
    }
}