import { Tags } from '../Tags';
import icon from './PixivComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';
import { BufferToHexString } from '../BufferEncoder';

type APIMangaPage = {
    data: {
        magazines: { id: number } []
    }
}

type APIManga = {
    data: {
        official_work: {
            id: number,
            name: string
        }
    }
}

type APIMangas = {
    data: {
        official_works: {
            id: number,
            title : string
        }[]
    }
}

type APIChapters = {
    data: {
        episodes: {
            readable: boolean,
            episode: {
                id: number,
                numbering_title: string,
                sub_title : string
            }
        }[]
    }
}

type APISalt = {
    pageProps: {
        salt : string
    }
}

type APIPages = {
    data: {
        reading_episode: {
            pages: APIPage[]
        }
    }
}

type APIPage = {
    url: string,
    key: string,
    gridsize: number,
    width: number,
    height: number
}

export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://comic.pixiv.net/api/app/';
    private nextBuild = 'qLzb8dhGOIox-xYNKI0tH';

    public constructor() {
        super('pixivcomics', `pixivコミック`, 'https://comic.pixiv.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript(new Request(new URL(this.URI)), `__NEXT_DATA__.buildId`, 2500) ?? this.nextBuild;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/works/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const request = this.PrepareRequest(new URL('works/v5/' + uri.pathname.match(/\d+$/)[0], this.apiURL));
        const { data: { official_work: { id, name } } } = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, id.toString(), name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const request = this.PrepareRequest(new URL('magazines', this.apiURL));
        const { data: { magazines } } = await FetchJSON<APIMangaPage>(request);
        const pages = magazines.map(item => item.id);
        for (const page of pages) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = this.PrepareRequest(new URL(`magazines/v2/${page}/works`, this.apiURL));
        const { data: { official_works } } = await FetchJSON<APIMangas>(request);
        return official_works.map(({ id, title }) => new Manga(this, provider, id.toString(), title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const request = this.PrepareRequest(new URL(`works/${manga.Identifier}/episodes?page=${page}`, this.apiURL));
        const { data: { episodes } } = await FetchJSON<APIChapters>(request);
        return episodes
            .filter(item => item.readable)
            .map(item => {
                return new Chapter(this, manga, item.episode.id.toString(), item.episode.numbering_title + (!item.episode.sub_title ? '' : ' - ' + item.episode.sub_title));
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pageProps: { salt } } = await FetchJSON<APISalt>(new Request(new URL(`/_next/data/${this.nextBuild}/viewer/stories/${chapter.Identifier}.json?id=${chapter.Identifier}`, this.URI)));

        const timestamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
        const plaintext = new TextEncoder().encode(timestamp + salt);
        const hash = BufferToHexString(await crypto.subtle.digest('SHA-256', plaintext));
        const uri = new URL(`episodes/${chapter.Identifier}/read_v4`, this.apiURL);
        const request = new Request(uri, {
            headers: {
                'x-requested-with': 'pixivcomic',
                'x-client-time': timestamp,
                'x-client-hash': hash
            }
        });

        const { data: { reading_episode: { pages } } } = await FetchJSON<APIPages>(request);
        return pages.map(image => new Page<APIPage>(this, chapter, new URL(image.url), { ...image }));
    }

    public override async FetchImage(page: Page<APIPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const payload = page.Parameters;
        const data = await this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, {
                method: 'GET',
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.href,
                    Accept: '*/*',
                    'X-Cobalt-Thumber-Parameter-GridShuffle-Key': payload.key
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);

        return DeScramble(data, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const scrambled = ctx.getImageData(0, 0, payload.width, payload.height).data;
            const descrambled = await this.DescrambleData(scrambled, 4, payload.width, payload.height, payload.gridsize, payload.gridsize, '4wXCKprMMoxnyJ3PocJFs4CYbfnbazNe', payload.key, true);
            ctx.putImageData(new ImageData(descrambled, payload.width, payload.height), 0, 0);
        });
    }

    private async DescrambleData(scrambledData: Uint8ClampedArray, t: number, width: number, height: number, colSize: number, rowSize: number, salt: string, key: string, reverse: boolean): Promise<Uint8ClampedArray> {
        const d = Math.ceil(height / rowSize),
            c = Math.floor(width / colSize),
            u = Array(d).fill(null).map(() => Array.from(Array(c).keys()));
        {
            const keyBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + key));
            const shuffler = new PixivShuffler(new Uint32Array(keyBuffer, 0, 4));

            for (let e = 0; e < 100; e++) shuffler.Next();
            for (let e = 0; e < d; e++) {
                const t = u[e];
                for (let e = c - 1; e >= 1; e--) {
                    const i = shuffler.Next() % (e + 1),
                        n = t[e];
                    t[e] = t[i],
                    t[i] = n;
                }
            }
        }
        if (reverse) for (let e = 0; e < d; e++) {
            const t = u[e],
                i = t.map((e, i) => t.indexOf(i));
            if (i.some(e => e < 0)) throw Error('Failed to reverse shuffle table');
            u[e] = i;
        }
        const h = new Uint8ClampedArray(scrambledData.length);
        for (let a = 0; a < height; a++) {
            const r = Math.floor(a / rowSize),
                l = u[r];
            for (let r = 0; r < c; r++) {
                const s = l[r],
                    o = r * colSize,
                    d = (a * width + o) * t,
                    c = s * colSize,
                    u = (a * width + c) * t,
                    p = colSize * t;
                for (let t = 0; t < p; t++) h[d + t] = scrambledData[u + t];
            }
            {
                const r = c * colSize,
                    s = (a * width + r) * t,
                    l = (a * width + width) * t;
                for (let t = s; t < l; t++) h[t] = scrambledData[t];
            }
        }
        return h;
    }

    private PrepareRequest(url: URL): Request {
        return new Request(url, {
            headers: {
                'X-Requested-With': 'pixivcomic',
                Referer: this.URI.href
            }
        });
    }

}

class PixivShuffler {
    private readonly s = new Uint32Array(4);

    public Next() {
        const e = 9 * this.Tj(5 * this.s[1] >>> 0, 7) >>> 0,
            t = this.s[1] << 9 >>> 0;
        return this.s[2] = (this.s[2] ^ this.s[0]) >>> 0,
        this.s[3] = (this.s[3] ^ this.s[1]) >>> 0,
        this.s[1] = (this.s[1] ^ this.s[2]) >>> 0,
        this.s[0] = (this.s[0] ^ this.s[3]) >>> 0,
        this.s[2] = (this.s[2] ^ t) >>> 0,
        this.s[3] = this.Tj(this.s[3], 11),
        e;
    }

    constructor(e: Uint32Array) {
        //if (4 !== e.length) throw Error('seed.length !== 4 (seed.length: '.concat(e.length, ')'));
        this.s = new Uint32Array(e),
        0 === this.s[0] &&
            0 === this.s[1] &&
            0 === this.s[2] &&
            0 === this.s[3] &&
            (this.s[0] = 1);
    }

    private Tj(e: number, t: number) {
        return (e << (t %= 32) >>> 0 | e >>> 32 - t) >>> 0;
    }
}