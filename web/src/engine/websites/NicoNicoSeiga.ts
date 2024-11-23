import { Tags } from '../Tags';
import icon from './NicoNicoSeiga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIManga = {
    id: number,
    title: string
}

type APIMedia = {
    id: number,
    meta: {
        title: string
    }
}

type APIPages = APIResult<{
    meta: {
        source_url: string,
        drm_hash: string | null
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

type PageData = {
    drm_hash: string
}

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.nicomanga.jp/api/v1/app/manga/';

    public constructor() {
        super('niconicoseiga', `ニコニコ静画 (niconico seiga)`, 'https://manga.nicovideo.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https://(sp.)?manga.nicovideo.jp/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { result: { id, meta: { title } } } } = await FetchJSON<APIResult<APIMedia>>(new Request(new URL(`contents/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, id.toString(), title);
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
        return (Array.isArray(data) ? data : []).map(manga => new Manga(this, provider, manga.id.toString(), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { meta, data: { result } } = await FetchJSON<APIResult<APIMedia[]>>(new Request(new URL(`contents/${manga.Identifier}/episodes`, this.apiUrl)));
        return meta.status === 200 ? result.map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.meta.title.replace(manga.Title, '') ?? chapter.meta.title )) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { meta, data: { result } } = await FetchJSON<APIPages>(new Request(new URL(`episodes/${chapter.Identifier}/frames`, this.apiUrl)));
        return meta.status === 200 ? result.map(page => new Page<PageData>(this, chapter, new URL(page.meta.source_url), { drm_hash: page.meta.drm_hash })) : [];
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.drm_hash ? data : this.DecryptImage(data, page.Parameters.drm_hash);
    }

    private async DecryptImage(blob: Blob, key: string): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = new Uint8Array(key.slice(0, 16).match(/.{1,2}/g).map(e => parseInt(e, 16)));
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % 8];
        return Common.GetTypedData(bytes.buffer);
    }
}