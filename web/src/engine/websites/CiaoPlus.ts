import { Tags } from '../Tags';
import icon from './CiaoPlus.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    title_list: {
        title_id: number,
        title_name: string
        episode_id_list: number[]
    }[]

}

type APIChapters = {
    episode_list: {
        episode_id: number,
        episode_name: string
    }[]
}

type APIPages = {
    scramble_seed: number,
    page_list: string[]
}

type TDimension = {
    width: number,
    height: number
}

export default class extends DecoratableMangaScraper {

    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/comics/title/(\\d+)/episode/\\d+$`);
    private readonly apiUrl = 'https://api.ciao.shogakukan.co.jp/';

    public constructor() {
        super('ciaoplus', 'Ciao Plus', 'https://ciao.shogakukan.co.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = parseInt(url.match(this.mangaRegexp)[1]);
        const endpointUrl = new URL(`/title/list?version=6.0.0&platform=3&title_id_list=${mangaid}`, this.apiUrl);
        const request = await this.CreateRequest(endpointUrl);
        const { title_list } = await FetchJSON<APIMangas>(request);
        return new Manga(this, provider, title_list[0].title_id.toString(), title_list[0].title_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //get chapters id
        let endpointUrl = new URL(`/title/list?version=6.0.0&platform=3&title_id_list=${manga.Identifier}`, this.apiUrl);
        let request = await this.CreateRequest(endpointUrl);
        const { title_list } = await FetchJSON<APIMangas>(request);
        const chaptersIds = title_list[0].episode_id_list;
        const chapters: Chapter[] = [];

        //request is limited to 50 chapters
        const chunkSize = 50;
        const chaptersChunks: Array<Array<number>> = [];
        for (let i = 0; i < chaptersIds.length; i += chunkSize) {
            const chunk = chaptersIds.slice(i, i + chunkSize);
            chaptersChunks.push(chunk);
        }

        for (const chapterChunk of chaptersChunks) {
            endpointUrl = new URL(`/episode/list`, this.apiUrl);
            request = await this.CreateRequest(endpointUrl, [
                ['version', '6.0.0'],
                ['platform', '3'],
                ['episode_id_list', chapterChunk.toString()]
            ]);

            const { episode_list } = await FetchJSON<APIChapters>(request);
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //https://api.ciao.shogakukan.co.jp/web/episode/viewer?version=6.0.0&platform=3&episode_id=5477
        const endpointUrl = new URL(`/web/episode/viewer?version=6.0.0&platform=3&episode_id=${chapter.Identifier}`, this.apiUrl);
        const request = await this.CreateRequest(endpointUrl);
        const { page_list, scramble_seed } = await FetchJSON<APIPages>(request);
        return page_list.map(page => new Page(this, chapter, new URL(page), { seed: scramble_seed }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const scramble_seed = page.Parameters['seed'] as number;
        const COL_NUM = 4;

        return DeScramble(blob, async (image, ctx) => {

            function getPieceDimension(width: number, height: number, t: number): TDimension {

                if (width < t || height < t) return null;
                const s = Cs(t, 8);
                return width > s && height > s && (width = Math.floor(width / s) * s, height = Math.floor(height / s) * s),
                {
                    width: Math.floor(width / t),
                    height: Math.floor(height / t)
                };
            }

            function Cs(e: number, i: number): number {
                e > i && ([e, i] = [i, e]);
                const t = (s, o) => s ? t(o % s, s) : o;
                return e * i / t(e, i);
            }

            const xs = function* (e: number, i: number) {
                yield* Is([...Array(e ** 2)].map((s, o) => o), i).map(
                    (s, o) => ({
                        source: {
                            x: s % e,
                            y: Math.floor(s / e)
                        },
                        dest: {
                            x: o % e,
                            y: Math.floor(o / e)
                        }
                    })
                );
            };
            function Is(e: number[], seed: number) : number[] {
                const t = Ls(seed);
                return e.map(o => [t.next().value, o]).sort((o, r) => + (o[0] > r[0]) - + (r[0] > o[0])).map(o => o[1]);
            }

            const Ls = function* (seed: number) {
                const i = Uint32Array.of(seed);
                for (; ;) i[0] ^= i[0] << 13,
                i[0] ^= i[0] >>> 17,
                i[0] ^= i[0] << 5,
                yield i[0];
            };

            ctx.drawImage(image, 0, 0);
            const o = getPieceDimension(image.width, image.height, COL_NUM);
            ctx.clearRect(0, 0, o.width * COL_NUM, o.height * COL_NUM);
            for (const piece of xs(COL_NUM, scramble_seed ?? 1)) {
                ctx.drawImage(
                    image,
                    piece.source.x * o.width,
                    piece.source.y * o.height,
                    o.width,
                    o.height,
                    piece.dest.x * o.width,
                    piece.dest.y * o.height,
                    o.width,
                    o.height
                );
            }

        });
    }

    private async CreateRequest(endpoint: URL | string, postData: string[][] = undefined): Promise<Request> {
        const url = typeof endpoint === 'string' ? new URL(endpoint) : endpoint;

        //CALCULATE THE HASH for the request body OR request parameters
        const params = postData ? Object.fromEntries(postData) : Object.fromEntries(url.searchParams);
        const keys = Object.keys(params).sort();
        const hashtable: string[] = [];
        for (const key of keys) {
            const keyHash = await this.SHA(key, 'SHA-256');
            const valueHash = await this.SHA(params[key], 'SHA-512');
            hashtable.push([keyHash, valueHash].join('_'));
        }

        //platform 3 = d294fcce0cc88587843099d85dd805aeef1b09a63b0db1dd3e4dc62a343c1db5_3bafbf08882a2d10133093a1b8433f50563b93c14acd05b79028eb1d12799027241450980651994501423a66c276ae26c43b739bc65c4e16b10c3af6c202aebb
        //title_id_list 206 = ab64d73d61fd0aca64d927401adb3a267105307ee8de12dc2313443a2ce2cb5c_33d7bcca06466d44b59bcb0683b2542acf08e476e2a7faffb3800f6a01b0c13a9049999a42f3dd159db0d85c7208cfc67f933c927cf48878058f0931e97ee1a3
        //version 6.0.0 = "5ca4f3850ccc331aaf8a257d6086e526a3b42a63e18cb11d020847985b31d188_6a2f355dc194a53a7d87513d236514b5e85bd3da886e37f93dcbda18f9d4204aa74b5c1eb2063547e6afa206d8bafe860896a271baa83a5e0a836fe44da2a7c3"

        let bambihash = await this.SHA(hashtable.toString(), 'SHA-256'); //2cc9285228b63b58c6cc404082904170a7e4f89fb9c3cee00c53a7f67ad5ed6b
        bambihash = await this.SHA(bambihash, 'SHA-512'); //ad63b1c89a6aa7bf0664adcc99d2fc212c77795f8c83b05c0b1ade00da16a1b375516d963de2e70aee53843ed8d0eeaf4c6ecc32732c3b7d9bda63f6d6a5916e

        return postData ?
            new Request(url, {
                method: 'POST',
                body: new URLSearchParams(postData).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-bambi-hash': bambihash,
                    Origin: this.URI.origin,
                    Referer: this.URI.href
                }
            }) : new Request(url, {
                method: 'GET',
                headers: {
                    'x-bambi-hash': bambihash,
                    Origin: this.URI.origin,
                    Referer: this.URI.href
                }
            });

    }
    private async SHA(text: string, cipher: string): Promise<string> {
        return Buffer.from(await crypto.subtle.digest(cipher, Buffer.from(text))).toString('hex');
    }
}