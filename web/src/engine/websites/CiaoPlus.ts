import { Tags } from '../Tags';
import icon from './CiaoPlus.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetHexFromBytes, GetBytesFromUTF8 } from '../BufferEncoder';

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

export type TDimension = {
    width: number,
    height: number
}

type PageSeed = {
    seed: number
}

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {
    protected apiUrl = 'https://api.ciao.shogakukan.co.jp/';
    protected requestHashProperty = 'x-bambi-hash';
    protected requestHashAppend: string = '';

    public constructor(id = 'ciaoplus', label = 'Ciao Plus', url = 'https://ciao.shogakukan.co.jp', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/title/\\d+/episode/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = parseInt(url.split('/').at(-3));
        const manga = await this.GetMangaDatas(mangaid.toString());
        return new Manga(this, provider, manga.id, manga.title);

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episode_list } = await this.GetMangaDatas(manga.Identifier);
        const chapters: Chapter[] = [];

        //request is limited to 50 chapters
        const chunkSize = 50;
        const chaptersChunks: Array<Array<number>> = [];
        for (let i = 0; i < episode_list.length; i += chunkSize) {
            const chunk = episode_list.slice(i, i + chunkSize);
            chaptersChunks.push(chunk);
        }

        for (const chapterChunk of chaptersChunks) {
            const request = await this.CreatePostRequest(`./episode/list`, new URLSearchParams({
                platform: '3',
                episode_id_list: chapterChunk.toString()
            }));

            const { episode_list } = await FetchJSON<APIChapters>(request);
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    protected GetPieceDimension(width: number, height: number, numCol: number): TDimension {
        if (width < numCol || height < numCol) return null;
        const s = this.Cs(numCol, 8);
        return width > s && height > s && (width = Math.floor(width / s) * s, height = Math.floor(height / s) * s),
        {
            width: Math.floor(width / numCol),
            height: Math.floor(height / numCol)
        };
    }

    private Cs(numCol: number, scale: number): number {
        numCol > scale && ([numCol, scale] = [scale, numCol]);
        const t = (s: number, o: number) => s ? t(o % s, s) : o;
        return numCol * scale / t(numCol, scale);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageSeed>[]> {
        const request = await this.CreateRequest(`./web/episode/viewer?0&platform=3&episode_id=${chapter.Identifier}`);
        const { page_list, scramble_seed } = await FetchJSON<APIPages>(request);
        return page_list.map(page => new Page<PageSeed>(this, chapter, new URL(page), { seed: scramble_seed }));
    }

    public override async FetchImage(page: Page<PageSeed>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const COL_NUM = 4;

        return DeScramble(blob, async (image, ctx) => {

            const pieceGenerator = function* (e: number, i: number) {
                yield* GetUnscrambledData([...Array(e ** 2)].map((s, o) => o), i).map(
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
            function GetUnscrambledData(e: number[], seed: number): number[] {
                const dataGenerator = UnscramblerFn(seed);
                return e.map(o => [dataGenerator.next().value, o]).sort((o, r) => + (o[0] > r[0]) - + (r[0] > o[0])).map(o => o[1]);
            }

            const UnscramblerFn = function* (seed: number) {
                const i = Uint32Array.of(seed);
                for (; ;) i[0] ^= i[0] << 13,
                i[0] ^= i[0] >>> 17,
                i[0] ^= i[0] << 5,
                yield i[0];
            };

            ctx.drawImage(image, 0, 0);
            const dimensions = this.GetPieceDimension(image.width, image.height, COL_NUM);
            ctx.clearRect(0, 0, dimensions.width * COL_NUM, dimensions.height * COL_NUM);
            for (const piece of pieceGenerator(COL_NUM, page.Parameters.seed ?? 1)) {
                ctx.drawImage(
                    image,
                    piece.source.x * dimensions.width,
                    piece.source.y * dimensions.height,
                    dimensions.width,
                    dimensions.height,
                    piece.dest.x * dimensions.width,
                    piece.dest.y * dimensions.height,
                    dimensions.width,
                    dimensions.height
                );
            }

        });
    }

    protected async GetMangaDatas(mangaId: string): Promise<MangaData> {
        const request = await this.CreateRequest(`./title/list?platform=3&title_id_list=${mangaId}`);
        const { title_list: [manga] } = await FetchJSON<APIMangas>(request);
        return {
            id: manga.title_id.toString(),
            title: manga.title_name.trim(),
            episode_list: manga.episode_id_list
        };
    }

    protected async CreateRequest(endpoint: string): Promise<Request> {
        const url = new URL(endpoint, this.apiUrl);
        const requestHash = await this.ComputeHash(url.searchParams);
        return new Request(url, {
            method: 'GET',
            headers: {
                [this.requestHashProperty]: requestHash,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
    }

    private async CreatePostRequest(endpoint: string, variables: URLSearchParams): Promise<Request> {
        const url = new URL(endpoint, this.apiUrl);
        const requestHash = await this.ComputeHash(variables);
        return new Request(url, {
            method: 'POST',
            body: variables.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                [this.requestHashProperty]: requestHash,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
    }

    private async ComputeHash(variables: URLSearchParams): Promise<string> {
        const params = Object.fromEntries(variables);
        const dictionary = {};
        for (const [key, value] of Object.entries(params)) typeof value != 'string' &&
            typeof value != 'number' || (dictionary[key] = value.toString());
        const hashtable: string[] = [];
        for (const key of Object.keys(dictionary).sort()) {
            hashtable.push(await this.DoubleSHA(key, dictionary[key]));
        }
        const hash = await this.SHA(hashtable.toString(), 'SHA-256');
        return await this.SHA(`${hash}${this.requestHashAppend}`, 'SHA-512');
    }

    protected async DoubleSHA(key: string, value: string): Promise<string> {
        const keyHash = await this.SHA(key, 'SHA-256');
        const valueHash = await this.SHA(value, 'SHA-512');
        return [keyHash, valueHash].join('_');
    }

    private async SHA(text: string, algorithm: AlgorithmIdentifier): Promise<string> {
        const hash = await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text));
        return GetHexFromBytes(new Uint8Array(hash));
    }
}