import { Tags } from '../Tags';
import icon from './NicoNicoSeiga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIMedia = {
    id: number;
    meta: {
        title: string;
    }
};

type APIPages = APIResult<{
    meta: {
        source_url: string;
        drm_hash: string | null;
    }
}[]>;

type APIResult<T> = {
    meta: {
        status: number;
    },
    data: {
        result: T;
    }
};

type PageData = {
    hash: string;
};

@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.mg_title div.title a', Common.PatternLinkGenerator('/manga/list?page={page}'), 0, anchor => ({ id: anchor.pathname.split('/').at(-1), title: anchor.text.trim() }))
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
        const { data: { result: { id, meta: { title } } } } = await FetchJSON<APIResult<APIMedia>>(new Request(new URL(`./contents/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { meta: { status }, data: { result } } = await FetchJSON<APIResult<APIMedia[]>>(new Request(new URL(`./contents/${manga.Identifier}/episodes`, this.apiUrl)));
        return status === 200 ? result.map(({ id, meta: { title } }) => new Chapter(this, manga, `${id}`, title.replace(manga.Title, '') ?? title)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { meta: { status }, data: { result } } = await FetchJSON<APIPages>(new Request(new URL(`./episodes/${chapter.Identifier}/frames`, this.apiUrl)));
        return status === 200 ? result.map(({ meta: { drm_hash: hash, source_url: url } }) => new Page<PageData>(this, chapter, new URL(url), { hash })) : [];
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.hash ? blob : this.DecryptImage(blob, page.Parameters.hash);
    }

    private async DecryptImage(blob: Blob, key: string): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = new Uint8Array(key.slice(0, 16).match(/.{1,2}/g).map(e => parseInt(e, 16)));
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % 8];
        return Common.GetTypedData(bytes.buffer);
    }
}