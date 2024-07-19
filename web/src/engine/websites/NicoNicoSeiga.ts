import { Tags } from '../Tags';
import icon from './NicoNicoSeiga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: number,
    title: string
}

type APIChapters = APIResult<{
    id: number,
    meta: {
        title: string
    }
}[]>;

type APIPages = APIResult<{
    meta: {
        source_url: string,
        drm_hash: string
    }
}[]>

type APIResult<T> = {
    meta: {
        status: number
    },
    data: {
        result: T
    }
}

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.nicomanga.jp/api/v1/app/manga/';
    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/comic/(\\d+)$`);

    public constructor() {
        super('niconicoseiga', `ニコニコ静画 (niconico seiga)`, 'https://sp.manga.nicovideo.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS<HTMLHeadingElement>(new Request(url), 'section.comic_header h2.title')).shift().textContent.trim();
        return new Manga(this, provider, url.match(this.mangaRegexp)[1], title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[] | null>(new Request(new URL(`/manga/ajax/ranking?span=hourly&category=all&page=${page}`, this.URI)));
        return (Array.isArray(data) ? data : []).map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { meta, data: { result } } = await FetchJSON<APIChapters>(new Request(new URL(`contents/${manga.Identifier}/episodes`, this.apiUrl)));
        return meta.status === 200 ? result.map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.meta.title.trim())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { meta, data: { result } } = await FetchJSON<APIPages>(new Request(new URL(`episodes/${chapter.Identifier}/frames`, this.apiUrl)));
        return meta.status === 200 ? result.map(page => new Page(this, chapter, new URL(page.meta.source_url), { drm_hash: page.meta.drm_hash })) : [];
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const encrypted = await data.arrayBuffer();
        const key = page.Parameters['drm_hash'] as string;
        const decrypted = this.Decrypt(new Uint8Array(encrypted), key);
        return Common.GetTypedData(decrypted);
    }

    private Decrypt(buffer: Uint8Array, key: string): Uint8Array {
        const xorkey = new Uint8Array(key.slice(0, 16).match(/.{1,2}/g).map(e => parseInt(e, 16)));
        const result = new Uint8Array(buffer);
        for (let n = 0; n < buffer.length; n++)
            result[n] = result[n] ^ xorkey[n % 8];
        return result;
    }
}