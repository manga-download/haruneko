import { Tags } from '../Tags';
import icon from './KadoComi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    result: T[];
};

type APIManga = APIResult<{
    code: string;
    title: string;
}>;

type APIChapter = {
    id: string;
    title: string;
    subtitle: string;
};

type APIMangaDetails = {
    work: {
        code: string;
        title: string;
    }
    firstEpisodes: APIResult<APIChapter>;
    latestEpisodes: APIResult<APIChapter>;
    comics: APIResult<{ episodes: APIChapter[] }>;
};

type APIPages = {
    manuscripts: APIPage[];
};

type APIPage = {
    drmMode: string;
    drmHash: string;
    drmImageUrl: string;
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comic-walker.com/api/';

    public constructor() {
        super('kadocomi', `カドコミ (KadoComi)`, 'https://comic-walker.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const workCode = new URL(url).pathname.match(/\/detail\/([^/]+)/).at(1); //strip search
        const { work: { title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./contents/details/work?workCode=${workCode}`, this.apiURL)));
        return new Manga(this, provider, workCode, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const { result } = await FetchJSON<APIManga>(new Request(new URL(`./search/keywords?keywords=&limit=100&offset=${page * 100}`, this.apiURL)));
                const mangas = result.map(({ code, title }) => new Manga(this, provider, code, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const { comics, firstEpisodes, latestEpisodes } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./contents/details/work?workCode=${manga.Identifier}`, this.apiURL)));

        // TODO: Array.fromAsync(...)
        chapterList.push(...this.GetChapters(manga, latestEpisodes.result));
        for (const { episodes } of comics.result) chapterList.push(...this.GetChapters(manga, episodes));
        chapterList.push(...this.GetChapters(manga, firstEpisodes.result));

        return chapterList.distinct();
    }

    private GetChapters(manga: Manga, result: APIChapter[]): Chapter[] {
        return result.map(({ id, title, subtitle }) => new Chapter(this, manga, id, [title, subtitle].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { manuscripts } = await FetchJSON<APIPages>(new Request(new URL(`./contents/viewer?episodeId=${chapter.Identifier}&imageSizeType=width:1284`, this.apiURL)));
        return manuscripts.map(page => new Page<APIPage>(this, chapter, new URL(page.drmImageUrl), { ...page }));
    }

    public override async FetchImage(page: Page<APIPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const { drmMode, drmHash } = page.Parameters;
        switch (drmMode) {
            case 'raw':
                return data;
            case 'xor':
                return this.DecryptXor(new Uint8Array(await data.arrayBuffer()), drmHash);
            default:
                throw Error('Encryption not supported');
        }
    }

    private async DecryptXor(encrypted: Uint8Array, passphrase: string): Promise<Blob> {
        return Common.GetTypedData(this.Xor(encrypted, this.GenerateKey(passphrase)));
    }

    private GenerateKey(t: string): Uint8Array {
        const e = t.slice(0, 16).match(/[\da-f]{2}/gi);
        if (null != e) return new Uint8Array(e.map(t => parseInt(t, 16)));
        throw new Error("failed generate key.");
    }

    private Xor(sourceArray: Uint8Array, keyArray: Uint8Array) {
        const result = new Uint8Array(sourceArray.length);
        for (let index = 0; index < sourceArray.length; index++)
            result[index] = sourceArray[index] ^ keyArray[index % keyArray.length];
        return result.buffer;
    }
}