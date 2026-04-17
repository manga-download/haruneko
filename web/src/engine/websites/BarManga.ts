import { Tags } from '../Tags';
import icon from './BarManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type PageData = {
    token: string;
    action: string;
    nonce: string;
    page: string;
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('barmanga', 'BarManga', 'https://archiviumbar.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const script = (await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), '.manga-reader-container +script')).at(0).text.trim();
        const tokens: string[] = JSON.parse(script.match(/(?:_tokens\s+?=\s+?)([^;]+)/).at(1));
        const nonce = script.match(/nonce:\s+?"([^"]+)/).at(1);
        const action = script.match(/action:\s+?"([^"]+)/).at(1);
        return Object.values(tokens).map((token, index) => new Page<PageData>(this, chapter, new URL('/wp-admin/admin-ajax.php', this.URI), { action, token, page: `${index + 1}`, nonce }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const body = new FormData();
            Object.entries(page.Parameters).forEach(([key, value]) => body.set(key, value));
            return (await Fetch(new Request(page.Link, {
                method: 'POST',
                headers: {
                    Referer: new URL(page.Parent.Identifier, this.URI).href,
                    Origin: this.URI.origin,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Sec-Fetch-Site': 'same-origin',
                }, body
            }))).blob();
        }, priority, signal);
    }
}