import { Tags } from '../Tags';
import icon from './CuuTruyen.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as W } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    data: T,
    _metadata: {
        total_pages: number,
    }
}

type APIManga = {
    id: number,
    name: string
}

type PagedMangaResult = {
    total_pages: number,
    mangas: Manga[]
}

type APIChapter = {
    id: number,
    name: string,
    number: string,
    status: string,
    pages: {
        image_url: string,
        drm_data: string,
        status: string
    }[]
}

type DrmData = {
    drmData: string
}

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v2/`;

    public constructor() {
        super('cuutruyen', 'Cứu Truyện', 'https://cuutruyen.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/mangas/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.split('/').at(-1);
        const { data: { name } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`mangas/${mangaid}`, this.apiUrl)));
        return new Manga(this, provider, mangaid, name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        const cancellator = new AbortController();
        try {
            const result = await this.GetMangasFromPage(1, provider, cancellator.signal);
            mangasList.push(...result.mangas);

            const promises = Array(result.total_pages - 1).fill(0).map(async (_, index) => {
                const { mangas } = await this.GetMangasFromPage(index + 2, provider, cancellator.signal);
                mangasList.push(...mangas);
            });
            await Promise.all(promises);
            return mangasList.distinct();
        } catch (error) {
            cancellator.abort();
            throw error;
        }
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, signal: AbortSignal): Promise<PagedMangaResult> {
        const { data, _metadata: { total_pages } } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`mangas/recently_updated?page=${page}&per_page=100`, this.apiUrl), { signal }));
        return {
            total_pages,
            mangas: data.map(manga => new Manga(this, provider, manga.id.toString(), manga.name))
        };
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`mangas/${manga.Identifier}/chapters`, this.apiUrl)));
        return data
            .filter((chapter) => chapter.status === 'processed')
            .map((chapter) => {
                const title = chapter.name ? `Chapter ${chapter.number} : ${chapter.name}` : `Chapter ${chapter.number}`;
                return new Chapter(this, manga, chapter.id.toString(), title.trim());
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await FetchJSON<APIResult<APIChapter>>(new Request(new URL(`chapters/${chapter.Identifier}`, this.apiUrl)));
        if (pages.some((image) => image.status !== 'processed')) {
            throw new Exception(W.Plugin_CuuTruyen_Error_NotProcessed);
        }
        return pages.map(page => new Page<DrmData>(this, chapter, new URL(page.image_url), { drmData: page.drm_data }));
    }

    public override async FetchImage(page: Page<DrmData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.drmData ? blob : DeScramble(blob, async (image, ctx) => {
            const decryptedDrmData = decodeXorCipher(atob(page.Parameters.drmData), '3141592653589793');
            let sy = 0;
            for (const piece of decryptedDrmData.split('|').slice(1)) {
                const [dy, height] = piece.split('-', 2).map(Number);
                ctx.drawImage(image, 0, sy, image.width, height, 0, dy, image.width, height);
                sy += height;
            }
        });
    }
}

function decodeXorCipher(data: string, key: string): string {
    let output = '';
    for (let i = 0; i < data.length; i++) {
        output += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return output;
}