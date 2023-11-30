import { Tags } from '../Tags';
import icon from './MadaraDex.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import { Fetch, FetchCSS, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeProxify from '../transformers/ImageLinkDeProxifier';

function ChapterPageExtractor(this: MangaScraper, image: HTMLImageElement): string {
    const url = image.dataset?.src || image.dataset?.lazySrc || image.srcset || image.src;
    const uri = new URL(url.trim(), this.URI);
    return uri.href;
}

@Madara.MangaCSS(/^{origin}\/title\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Read "])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madaradex', 'MadaraDex', 'https://madaradex.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLImageElement>(request, 'div.page-break img');
        return data.map(element => {
            const link = new URL(ChapterPageExtractor.call(this, element), request.url);
            let referer = link.searchParams.get('domain') ?? this.URI.origin;
            referer += '/';
            return new Page(this, chapter, DeProxify(link), { Referer: referer });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal,
                headers: {
                    Referer: page.Parameters.Referer,
                    "User-Agent": 'Mozilla/5.0 (iPod; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1'
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);

    }
}