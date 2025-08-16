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
        const data = await FetchCSS<HTMLImageElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.page-break img');
        return data.map(element => {
            const url = new URL(element.dataset?.src || element.dataset?.lazySrc || element.srcset || element.getAttribute('src'));
            const referer = url.searchParams.get('domain') ? new URL(url.searchParams.get('domain')).href : new URL(chapter.Identifier, this.URI).href;
            return new Page(this, chapter, this.DeProxify(url), { Referer: referer });
        });
    }

    private DeProxify(link: URL): URL {
        if (/cdn\.madaradex\.org\/proxy/.test(link.href)) {//they have proxy, proxy_v1, probably more
            return new URL(link.searchParams.get('url') || '');
        }
        return link;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const headers = {
                'Referer': page.Parameters.Referer,
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*;q=0.8,**;q=0.5',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Site': 'same-site',
            };
            let response = await Fetch(new Request(page.Link, { signal, headers }));
            return response.blob();
        }, priority, signal);
    };
}