import { type Tag, Tags } from '../Tags';
import icon from './ToCoronaEx.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIResults<T> = {
    next_cursor: string,
    resources: T
}

type APIManga = {
    id: string,
    title: string
}

type APIChapter = {
    id: string,
    title: string,
    episode_order: number
}

type APIPages = {
    pages: {
        page_image_url: string,
        drm_hash: string
    }[]
}
export default class extends DecoratableMangaScraper {

    protected apiurl = 'https://api.to-corona-ex.com';
    protected apikey = 'K4FWy7Iqott9mrw37hDKfZ2gcLOwO-kiLHTwXT8ad1E=';

    public constructor(public readonly Identifier: string = 'to-corona-ex', public readonly Title: string = 'コロナ (to-corona-ex)', url: string = 'https://to-corona-ex.com', tags: Tag[] = [Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official]) {
        super(Identifier, Title, url, ...tags);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comics/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/\/comics\/(\d+)/)[1];
        const data = await FetchJSON<APIManga>(this.CreateRequest(new URL(`/comics/${id}`, this.apiurl)));
        return new Manga(this, provider, data.id, data.title.replace('@COMIC', '').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let url: URL | null = new URL('/comics?order=asc&sort=title_yomigana', this.apiurl); url != null;) {
            const { resources, next_cursor } = await FetchJSON<APIResults<APIManga[]>>(this.CreateRequest(url));
            resources.forEach(manga => mangaList.push(
                new Manga(this, provider, manga.id, manga.title.replace('@COMIC', '').trim())
            ));
            url = next_cursor ? new URL(`/comics?order=asc&sort=title_yomigana&after_than=${next_cursor}`, this.apiurl) : null;
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];

        for (let url: URL | null = new URL(`/episodes?comic_id=${manga.Identifier}&episode_status=free_viewing%2Conly_for_subscription&order=asc&sort=episode_order`, this.apiurl); url != null;) {
            const { resources, next_cursor } = await FetchJSON<APIResults<APIChapter[]>>(this.CreateRequest(url));
            resources.forEach(chapter => chapterList.push(
                new Chapter(this, manga, chapter.id, chapter.title.trim())
            ));
            url = next_cursor ? new URL(`/episodes?comic_id=${manga.Identifier}&episode_status=free_viewing%2Conly_for_subscription&order=asc&sort=episode_order&after_than=${next_cursor}`, this.apiurl) : null;
        }
        return chapterList.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/episodes/${chapter.Identifier}/begin_reading`, this.apiurl);
        const data = await FetchJSON<APIPages>(this.CreateRequest(url));
        return data.pages.map(page => new Page(this, chapter, new URL(page.page_image_url), { drm_hash: page.drm_hash }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data: Blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters.drm_hash) return data;
        const key = page.Parameters.drm_hash as string;

        return DeScramble(data, async (image, ctx) => {
            function decodeKey(e: string): number[] {
                const n: number[] = [];
                const t = window.atob(e);
                for (let r = 0; r < t.length; r++) {
                    n[r] = t.charCodeAt(r);
                }
                return n;
            }

            const r = decodeKey(key);
            const i = r[0];
            const o = r[1];
            const a = r.slice(2);
            const numPieces = i * o;
            const l = Math.floor((image.width - image.width % 8) / i);
            const f = Math.floor((image.height - image.height % 8) / o);

            ctx.drawImage(image, 0, 0);

            for (let index = 0; index < numPieces; index++) {
                const h = a[index],
                    p = h % i,
                    m = Math.floor(h / i),
                    g = index % i,
                    v = Math.floor(index / i);
                ctx.drawImage(image, p * l, m * f, l, f, g * l, v * f, l, f);
            }

        });
    }

    private CreateRequest(url: URL): Request {
        return new Request(url, {
            headers: {
                'X-API-Environment-Key': this.apikey
            }
        });
    }

}