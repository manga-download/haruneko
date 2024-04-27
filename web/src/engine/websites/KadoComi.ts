import { Tags } from '../Tags';
import icon from './KadoComi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    result: T[];
}

type APIManga = {
    code: string,
    title: string
}

type APIChapter = {
    id: string,
    title: string,
    subtitle: string
}

type APIMangaDetails = {
    work: {
        code: string,
        title: string,
    },
    firstEpisodes: APIResult<APIChapter>
    ,
    latestEpisodes: APIResult<APIChapter>
    ,
    comics: {
        result: {
            episodes: APIChapter[]
        }[]
    }
}

type APIPages = {
    manuscripts: APIPage[]
}

type APIPage = {
    drmMode: string,
    drmHash: string,
    drmImageUrl: string
}

export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://comic-walker.com/api/';

    public constructor() {
        super('kadocomi', `カドコミ (KadoComi)`, 'https://comic-walker.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/detail/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const workCode = new URL(url).pathname.match(/\/detail\/([^/]+)/)[1]; //strip search
        const apiCallUrl = new URL(`contents/details/work?workCode=${workCode}`, this.apiURL);
        const { work } = await FetchJSON<APIMangaDetails>(new Request(apiCallUrl));
        return new Manga(this, provider, workCode, work.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 0, run = true; run; page++) { //start at 0 otherwise miss mangas
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(`search/keywords?keywords=&limit=100&offset=${page * 100}`, this.apiURL);
        const { result } = await FetchJSON<APIResult<APIManga>>(new Request(url));
        return result.map(manga => new Manga(this, provider, manga.code, manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const apiCallUrl = new URL(`contents/details/work?workCode=${manga.Identifier}`, this.apiURL);
        const data = await FetchJSON<APIMangaDetails>(new Request(apiCallUrl));

        for (const list of [data.firstEpisodes, data.latestEpisodes]) {
            chapterList.push(...this.GetChapters(manga, list));
        }

        for (const comic of data.comics.result) {
            chapterList.push(...comic.episodes.map(episode => new Chapter(this, manga, episode.id, episode.title.trim())));
        }
        return chapterList.distinct();
    }

    private GetChapters(manga: Manga, list: APIResult<APIChapter>): Chapter[] {
        return list.result.map(episode => {
            const title = [episode.title, episode.subtitle].join(' ').trim();
            return new Chapter(this, manga, episode.id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const apiCallUrl = new URL(`contents/viewer?episodeId=${chapter.Identifier}&imageSizeType=width:1284`, this.apiURL);
        const { manuscripts } = await FetchJSON<APIPages>(new Request(apiCallUrl));
        return manuscripts.map(page => new Page(this, chapter, new URL(page.drmImageUrl), { ...page }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const payload = page.Parameters as APIPage;
        switch (payload.drmMode) {
            case 'raw':
                return data;
            case 'xor': {
                return this.DecryptXor(new Uint8Array(await data.arrayBuffer()), payload.drmHash);
            }
            default:
                throw Error('Encryption not supported');
        }

    }

    private async DecryptXor(encrypted: Uint8Array, passphrase: string): Promise<Blob> {
        const key = this.GenerateKey(passphrase);
        return Common.GetTypedData(this.Xor(encrypted, key));
    }

    private GenerateKey(t: string): Uint8Array {
        const e = t.slice(0, 16).match(/[\da-f]{2}/gi);
        if (null != e)
            return new Uint8Array(e.map(function (t) {
                return parseInt(t, 16);
            }));
        throw new Error("failed generate key.");
    }

    private Xor(t: Uint8Array, e: Uint8Array) {
        const r = t.length;
        const i = e.length;
        const o = new Uint8Array(r);

        for (let a = 0; a < r; a += 1)
            o[a] = t[a] ^ e[a % i];
        return o;
    }
}