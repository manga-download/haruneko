import { Tags } from '../Tags';
import icon from './MadaraDex.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import { FetchCSS, Fetch } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

@Madara.MangaCSS(/^{origin}\/title\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Read "])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madaradex', 'MadaraDex', 'https://madaradex.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        uri.searchParams.set('style', 'list');
        const data = await FetchCSS<HTMLImageElement>(new Request(uri), 'div.page-break img');
        return data.map(img => {
            const uri = new URL(img.dataset?.src || img.dataset?.lazySrc || img.srcset || img.getAttribute('src'));
            return new Page(this, chapter, new URL(uri.searchParams.get('url') || uri), {
                Referer: new URL(uri.searchParams.get('domain') || chapter.Identifier, this.URI).href,
            });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const headers = {
                'Referer': page.Parameters.Referer,
                'Sec-Fetch-Site': 'same-site',
            };
            const response = await Fetch(new Request(page.Link, { signal, headers }));
            return response.blob();
        }, priority, signal);
    };
}