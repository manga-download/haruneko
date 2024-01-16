import { Tags } from '../Tags';
import icon from './Ynjn.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';

type APIResult<T> = {
    data: T,
    is_success: boolean
}

type APIManga = {
    book: {
        name: string
    }
}

type APIChapters = {
    episodes: {
        id: number,
        name: string
    }[]
}

type APIPages = {
    pages: {
        manga_page: {
            page_image_url: string
        }
    }[]
}

@Common.MangasNotSupported()

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://webapi.ynjn.jp';

    public constructor() {
        super('ynjn', `ヤンジャン！(ynjn)`, 'https://ynjn.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const request = new Request(new URL(`book/${id}`, this.apiUrl).href);
        const { data } = await FetchJSON<APIResult<APIManga>>(request);
        return new Manga(this, provider, id, data.book.name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`title/${manga.Identifier}/episode`, this.apiUrl);
        uri.searchParams.set('is_get_all', 'true');
        const json = await FetchJSON<APIResult<APIChapters>>(new Request(uri.href));
        return json.is_success ? json.data.episodes.map(episode => new Chapter(this, manga, episode.id.toString(), episode.name.trim())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/viewer', this.apiUrl);
        uri.searchParams.set('title_id', chapter.Parent.Identifier);
        uri.searchParams.set('episode_id', chapter.Identifier);
        const json = await FetchJSON<APIResult<APIPages>>(new Request(uri.href));
        return json.is_success ? json.data.pages
            .filter(page => page.manga_page)
            .map(page => new Page(this, chapter, new URL(page.manga_page.page_image_url))) : [];
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data: Blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(data, async (bitmap, ctx) => {
            const imageWidth = bitmap.width;
            const imageHeight = bitmap.height;
            const blockWidth = Math.floor(imageWidth / 4);
            const blockHeight = Math.floor(imageHeight / 4);
            ctx.clearRect(0, 0, imageWidth, imageHeight);
            ctx.drawImage(bitmap, 0, 0, imageWidth, imageHeight);
            let y: number = undefined;

            for (let blockIndex = 0; blockIndex < 16; blockIndex++) {
                const A = Math.floor(blockIndex / 4) * blockHeight;
                const P = blockIndex % 4 * blockWidth;
                const s = Math.floor(blockIndex / 4);
                const C = (y = blockIndex % 4 * 4 + s) % 4 * blockWidth;
                const k = Math.floor(y / 4) * blockHeight;
                ctx.drawImage(bitmap, P, A, blockWidth, blockHeight, C, k, blockWidth, blockHeight);
            }
        });
    }

}