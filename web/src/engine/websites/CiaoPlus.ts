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

@Common.MangasNotSupported()
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
        const request = await this.CreateRequest(`/title/list?platform=3&title_id_list=${mangaid}`);
        const { title_list: [manga] } = await FetchJSON<APIMangas>(request);
        return new Manga(this, provider, manga.title_id.toString(), manga.title_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let request = await this.CreateRequest(`/title/list?platform=3&title_id_list=${manga.Identifier}`);
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
            request = await this.CreatePostRequest(`/episode/list`, new URLSearchParams({
                platform: '3',
                episode_id_list: chapterChunk.toString()
            }));

            const { episode_list } = await FetchJSON<APIChapters>(request);
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = await this.CreateRequest(`/web/episode/viewer?0&platform=3&episode_id=${chapter.Identifier}`);
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
            function Is(e: number[], seed: number): number[] {
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

    private async CreateRequest(endpoint: string): Promise<Request> {
        const url = new URL(endpoint, this.apiUrl);
        const bambihash = await this.ComputeBambiHash(url.searchParams);
        return new Request(url, {
            method: 'GET',
            headers: {
                'x-bambi-hash': bambihash,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
    }

    private async CreatePostRequest(endpoint: string, variables: URLSearchParams): Promise<Request> {
        const url = new URL(endpoint, this.apiUrl);
        const bambihash = await this.ComputeBambiHash(variables);
        return new Request(url, {
            method: 'POST',
            body: variables.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-bambi-hash': bambihash,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
    }

    private async ComputeBambiHash(variables: URLSearchParams): Promise<string> {
        const params = Object.fromEntries(variables);
        const keys = Object.keys(params).sort();
        const hashtable: string[] = [];
        for (const key of keys) {
            const keyHash = await this.SHA(key, 'SHA-256');
            const valueHash = await this.SHA(params[key], 'SHA-512');
            hashtable.push([keyHash, valueHash].join('_'));
        }
        const bambihash = await this.SHA(hashtable.toString(), 'SHA-256');
        return await this.SHA(bambihash, 'SHA-512');

    }

    private async SHA(text: string, cipher: string): Promise<string> {
        return Buffer.from(await crypto.subtle.digest(cipher, Buffer.from(text))).toString('hex');
    }
}