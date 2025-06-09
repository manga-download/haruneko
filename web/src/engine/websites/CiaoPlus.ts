import { Tags } from '../Tags';
import icon from './CiaoPlus.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetHexFromBytes, GetBytesFromUTF8 } from '../BufferEncoder';

// TODO: Revision

type APIMangas = {
    title_list: {
        title_id: number,
        title_name: string
        episode_id_list: number[]
    }[]
}

export type MangaData = {
    id: string,
    title: string,
    episode_list: number[]
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

type PageSeed = {
    seed: number
}

export class DRMProvider {

    constructor(private readonly apiURL: string, readonly requestHeaderHash: { name: string, seed: string }) {}

    public async FetchAPI<T extends JSONElement>(endpoint: string, parameters: Record<string, string>, init: RequestInit = { method: 'GET' }): Promise<T> {
        const request = await this.CreateRequest(endpoint, init, parameters);
        return FetchJSON<T>(request);
    }

    private async CreateRequest(endpoint: string, init: RequestInit, parameters: Record<string, string>) {
        const payload = new URLSearchParams(parameters);
        const uri = new URL(endpoint, this.apiURL);
        if(/^POST$/i.test(init.method)) {
            init.body = payload;
        } else {
            uri.search = payload.toString();
        }
        const request = new Request(uri, init);
        request.headers.set(this.requestHeaderHash.name, await this.ComputeHash(payload, this.requestHeaderHash.seed));
        return request;
    }

    private async ComputeHash(parameters: URLSearchParams, seed: string): Promise<string> {
        parameters.sort();
        const parameterHashes = await Promise.all([ ...parameters.entries() ].map(async ([ key, value ]) => [
            await this.SHA(key, 'SHA-256'),
            await this.SHA(value, 'SHA-512'),
        ].join('_')));
        const aggreagteHash = await this.SHA(parameterHashes.join(','), 'SHA-256');
        return this.SHA(aggreagteHash + seed, 'SHA-512');
    }

    private async SHA(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
        const hash = await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text));
        return GetHexFromBytes(new Uint8Array(hash));
    }
}

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    protected readonly drm = new DRMProvider('https://api.ciao.shogakukan.co.jp/', {
        name: 'X-Bambi-Hash',
        seed: '',
    });

    public constructor(id = 'ciaoplus', label = 'Ciao Plus', url = 'https://ciao.shogakukan.co.jp', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator]) {
        super(id, label, url, ...tags );
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/title/\\d+/episode/\\d+$`).test(url);
    }

    protected async GetMangaDatas(mangaId: string): Promise<MangaData> {
        const { title_list: [ manga ] } = await this.drm.FetchAPI<APIMangas>('./title/list', {
            platform: '3',
            title_id_list: mangaId
        });
        return {
            id: manga.title_id.toString(),
            title: manga.title_name.trim(),
            episode_list: manga.episode_id_list,
        };
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = parseInt(url.split('/').at(-3));
        const manga = await this.GetMangaDatas(mangaid.toString());
        return new Manga(this, provider, manga.id, manga.title);

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return this.FetchChapterList(manga);
    }

    protected async FetchChapterList(manga: Manga): Promise<Chapter[]> {
        const { episode_list } = await this.GetMangaDatas(manga.Identifier);
        const chapters: Chapter[] = [];

        const chunkSize = 50;
        const chaptersChunks: Array<Array<number>> = [];
        for (let i = 0; i < episode_list.length; i += chunkSize) {
            const chunk = episode_list.slice(i, i + chunkSize);
            chaptersChunks.push(chunk);
        }

        for (const chapterChunk of chaptersChunks) {
            const { episode_list } = await this.drm.FetchAPI<APIChapters>(`./episode/list`, {
                platform: '3',
                episode_id_list: chapterChunk.toString(),
            }, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageSeed>[]> {
        const { page_list, scramble_seed } = await this.drm.FetchAPI<APIPages>('./web/episode/viewer', {
            0: '',
            platform: '3',
            episode_id: chapter.Identifier,
        });
        return page_list.map(page => new Page<PageSeed>(this, chapter, new URL(page), { seed: scramble_seed }));
    }

    public override async FetchImage(page: Page<PageSeed>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);

        return DeScramble(blob, async (image, ctx) => {

            ctx.drawImage(image, 0, 0);
            const o = getPieceDimension(image.width, image.height, COL_NUM);
            ctx.clearRect(0, 0, o.width * COL_NUM, o.height * COL_NUM);
            for (const piece of xs(COL_NUM, page.Parameters.seed ?? 1)) {
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
}

// Website Script

const COL_NUM = 4;

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