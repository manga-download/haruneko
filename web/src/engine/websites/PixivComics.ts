import { Tags } from '../Tags';
import icon from './PixivComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';

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

    public constructor() {
        super('pixivcomics', `pixivコミック`, 'https://comic.pixiv.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/works/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const request = this.prepareRequest(new URL('works/v5/' + uri.pathname.match(/\d+$/)[0], this.apiURL).href);
        const { data } = await FetchJSON<APIManga>(request);
        const id = data.official_work.id;
        const title = data.official_work.name.trim();
        return new Manga(this, provider, id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const uri = new URL('magazines', this.apiURL);
        const request = this.prepareRequest(uri.href);
        const { data } = await FetchJSON<APIMangaPage>(request);
        const pages = data.magazines.map(item => item.id);
        for (const page of pages) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(`magazines/v2/${page}/works`, this.apiURL);
        const request = this.prepareRequest(uri.href);
        const { data } = await FetchJSON<APIMangas>(request);
        return data.official_works.map(item => new Manga(this, provider, item.id.toString(), item.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    async getChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL(`works/${manga.Identifier}/episodes?page=${page}`, this.apiURL);
        const request = this.prepareRequest(uri.href);
        const { data } = await FetchJSON<APIChapters>(request);
        return data.episodes
            .filter(item => item.readable)
            .map(item => {
                return new Chapter(this, manga, item.episode.id.toString(), item.episode.numbering_title + (!item.episode.sub_title ? '' : ' - ' + item.episode.sub_title));
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const timestamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
        const plaintext = new TextEncoder().encode(timestamp + 'mAtW1X8SzGS880fsjEXlM73QpS1i4kUMBhyhdaYySk8nWz533nrEunaSplg63fzT');
        const hash = Buffer.from(await crypto.subtle.digest('SHA-256', plaintext)).toString('hex');
        const uri = new URL(`episodes/${chapter.Identifier}/read_v3`, this.apiURL);
        const request = new Request(uri.href, {
            headers: {
                'x-requested-with': 'pixivcomic',
                'x-client-time': timestamp,
                'x-client-hash': hash
            }
        });

        const { data } = await FetchJSON<APIPages>(request);
        return data.reading_episode.pages.map(image => new Page(this, chapter, new URL(image.url), { ...image }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const payload = page.Parameters as APIPage;
        const data = await this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link.href, {
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
            const descrambled = await this.descrambleData(scrambled, 4, payload.width, payload.height, payload.gridsize, payload.gridsize, '4wXCKprMMoxnyJ3PocJFs4CYbfnbazNe', payload.key, true);
            ctx.putImageData(new ImageData(descrambled, payload.width, payload.height), 0, 0);
        });
    }

    private async descrambleData(e, t, i, r, n, s, a, l, o): Promise<Uint8ClampedArray> {
        const d = Math.ceil(r / s),
            c = Math.floor(i / n),
            u = Array(d).fill(null).map(() => Array.from(Array(c).keys()));
        {
            const e = new TextEncoder().encode(a + l);
            const t = await crypto.subtle.digest('SHA-256', e);
            const i = new Uint32Array(t, 0, 4);
            const r = new PixivShuffler(i);

            for (let e = 0; e < 100; e++) r.next();
            for (let e = 0; e < d; e++) {
                const t = u[e];
                for (let e = c - 1; e >= 1; e--) {
                    const i = r.next() % (e + 1),
                        n = t[e];
                    t[e] = t[i],
                    t[i] = n;
                }
            }
        }
        if (o) for (let e = 0; e < d; e++) {
            const t = u[e],
                i = t.map((e, i) => t.indexOf(i));
            if (i.some(e => e < 0)) throw Error('Failed to reverse shuffle table');
            u[e] = i;
        }
        const h = new Uint8ClampedArray(e.length);
        for (let a = 0; a < r; a++) {
            const r = Math.floor(a / s),
                l = u[r];
            for (let r = 0; r < c; r++) {
                const s = l[r],
                    o = r * n,
                    d = (a * i + o) * t,
                    c = s * n,
                    u = (a * i + c) * t,
                    p = n * t;
                for (let t = 0; t < p; t++) h[d + t] = e[u + t];
            }
            {
                const r = c * n,
                    s = (a * i + r) * t,
                    l = (a * i + i) * t;
                for (let t = s; t < l; t++) h[t] = e[t];
            }
        }
        return h;
    }

    prepareRequest(url: string): Request {
        return new Request(url, {
            headers: {
                'X-Requested-With': 'pixivcomic',
                Referer: this.URI.href
            }
        });
    }

}
class PixivShuffler {
    s = new Uint32Array(4);
    next() {
        const e = 9 * this.tj(5 * this.s[1] >>> 0, 7) >>> 0,
            t = this.s[1] << 9 >>> 0;
        return this.s[2] = (this.s[2] ^ this.s[0]) >>> 0,
        this.s[3] = (this.s[3] ^ this.s[1]) >>> 0,
        this.s[1] = (this.s[1] ^ this.s[2]) >>> 0,
        this.s[0] = (this.s[0] ^ this.s[3]) >>> 0,
        this.s[2] = (this.s[2] ^ t) >>> 0,
        this.s[3] = this.tj(this.s[3], 11),
        e;
    }
    constructor(e) {
        if (4 !== e.length) throw Error('seed.length !== 4 (seed.length: '.concat(e.length, ')'));
        this.s = new Uint32Array(e),
        0 === this.s[0] &&
            0 === this.s[1] &&
            0 === this.s[2] &&
            0 === this.s[3] &&
            (this.s[0] = 1);
    }
    tj(e, t) {
        return (e << (t %= 32) >>> 0 | e >>> 32 - t) >>> 0;
    }
}