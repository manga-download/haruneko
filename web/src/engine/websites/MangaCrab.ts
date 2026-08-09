import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIChapters = {
    data: {
        list: string;
        total_pages: number;
    }
};

type PageKey = {
    imgKey: string;
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'title')
@Common.MangasMultiPageCSS('article.catalog-card > a', Common.PatternLinkGenerator('/series/page/{page}/'))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://mangacrab.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga_id, nonce } = await FetchWindowScript<{ manga_id: string, nonce: string }>(new Request(new URL(manga.Identifier, this.URI)), `
            new Promise( resolve => {
                resolve ({
                    manga_id : document.getElementById('mv-chapter-list').dataset.mangaId,
                    nonce : mvTheme.nonce
                });
            });
        `, 1500);

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { list, total_pages } } = await FetchJSON<APIChapters>(new Request(new URL('./wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: 'mv_get_chapters',
                        nonce,
                        manga_id,
                        page: `${page}`,
                        search: '',
                        _ts: `${Date.now()}`
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Referer: this.URI.href
                    }
                }));
                const chapters = [...new DOMParser().parseFromString(list, 'text/html').querySelectorAll('article.chapter-item div a')].map((chapter: HTMLAnchorElement) => {
                    return new Chapter(this, manga, chapter.pathname + chapter.search, chapter.text.trim());
                });
                yield* chapters;
                run = total_pages > page;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageKey>[]> {
        //NOT using script because of ad wall intermediate page interfering
        const [body] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), 'body');
        const imgKey = body.innerHTML.match(/['"]imgHeader['"]\s*:\s*['"]([^'"]+)['"]/).at(1);
        const images = [...body.querySelectorAll<HTMLImageElement>('img.mv-secure-img, div.page-break:not([style*="display: none"]) img:not([src]), div.reader-body img, #mv-reader-body img')]
            .map(image => this.PageLinkExtractor(image))
            .filter(image => image);
        return images.map(page => new Page<PageKey>(this, chapter, new URL(page, this.URI), { imgKey }));
    }

    private PageLinkExtractor(image: HTMLImageElement): string {
        return image.getAttribute("data-sec-src")
            || [...image.attributes]
                .map(attr => {
                    try {
                        return new URL(attr.value, this.URI).toString();
                    } catch {
                        return null;
                    }
                })
                .find(url => url?.includes('wp-content'))
            || image.getAttribute('data-src')
            || image.getAttribute('data-lazy-src')
            || image.getAttribute('srcset')?.split(' ')[0].trim()
            || image.getAttribute('data-cfsrc')
            || image.getAttribute('data-src-base64')
            || image.getAttribute('src');
    };

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return !page.Parameters.imgKey ? Common.FetchImageAjax.call(this, page, priority, signal) :
            this.imageTaskPool.Add(async () => {
                return (await Fetch(new Request(page.Link, {
                    headers: {
                        Referer: new URL(page.Parent.Identifier, this.URI).href,
                        'Node': page.Parameters.imgKey
                    },
                }))).blob();
            }, priority, signal);
    }
}
