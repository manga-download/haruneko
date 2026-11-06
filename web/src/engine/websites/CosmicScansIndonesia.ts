import { Tags } from '../Tags';
import icon from './CosmicScansIndonesia.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromHex, GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';
import { XOR } from '../Crypto';
import { AddAntiScrapingDetection } from '../platform/AntiScrapingDetection';

type APIResult<T> = {
    data: T;
};

type APIManga = APIResult<{
    slug: string;
    title: string;
}>;

type APIMangas = APIResult<APIManga['data'][]> & {
    cursor: {
        nextCursor: string;
    };
};

type APIChapters = APIResult<{
    chapters: {
        slug: string;
        chapterNum: string;
    }[];
}>;

type APIPages = APIResult<{
    pageCount: number;
}>;

type APISession = APIResult<{
    sessionId: string;
    axisKeys: string[];
}>;

AddAntiScrapingDetection(async invoke => invoke(`
    ${Common.TurnStileTokenScript('0x4AAAAAAFrnsF7VWVgNrK9k')}
`), /^https:\/\/\d+\.cosmicscans\.to\/chapter\//);

class SealedStore {
    private seed: Uint8Array<ArrayBuffer> | null = null;
    private sealedKeys = new Map<number, Uint8Array<ArrayBuffer>>();

    // Xorshift32 pseudo-random number generator
    private CreateRNG(seed: number): () => number {
        let state = seed | 0;

        return () => {
            state ^= state << 13;
            state ^= state >>> 17;
            state ^= state << 5;

            return state >>> 0;
        };
    }

    // Generate a 32-byte XOR mask for a slot
    private GenerateMask(slot: number): Uint8Array<ArrayBuffer> {
        if (!this.seed) {
            throw new Error('sealedStore: not initialized');
        }

        const seed = (
            Math.imul(2654435761, slot) ^
            (this.seed[0] << 8 | this.seed[1])
        ) >>> 0;

        const rng = this.CreateRNG(seed);
        const mask = new Uint8Array(32);

        for (let i = 0; i < mask.length; i++) {
            mask[i] = rng() & 0xff;
        }

        return mask;
    }

    // Initialize and seal keys
    Init(axisKeys: string[]): void {
        this.seed = crypto.getRandomValues(new Uint8Array(96));
        this.sealedKeys.clear();

        axisKeys.forEach((hexKey, slot) => {
            const key = GetBytesFromHex(hexKey);
            const mask = this.GenerateMask(slot);

            this.sealedKeys.set(slot, XOR(key, mask));
        });
    }

    // Retrieve and unseal a key
    Open(slot: number): Uint8Array<ArrayBuffer> {
        const sealedKey = this.sealedKeys.get(slot);

        if (!sealedKey) {
            throw new Error(`sealedStore: slot ${slot} not sealed`);
        }

        return XOR(sealedKey, this.GenerateMask(slot));
    }

    // Check initialization state
    IsReady(): boolean {
        return this.seed !== null && this.sealedKeys.size >= 2;
    }

    // Generate a signed page URL segment
    async ComputePageUrlSegment(sessionId: string, chapterSlug: string, pageIndex: number): Promise<string> {
        if (!this.IsReady()) {
            throw new Error('mintImageToken: sealed store not initialized');
        }
        const message = XOR(GetBytesFromUTF8(`${chapterSlug}:${pageIndex}:${Date.now()}`), this.Open(1));
        const cryptoKey = await crypto.subtle.importKey('raw', this.Open(0), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, message));
        return [sessionId, GetURLBase64FromBytes(signature), GetURLBase64FromBytes(message)].join('.');
    }
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://cdncid.csmcscns.id/v1/';

    public constructor() {
        super('cosmicscansid', 'Cosmic Scans Indonesia', 'https://04.cosmicscans.to', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe('^https://\\d+.cosmicscans.to/series/[^/]+/$').test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { title, slug } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/mangaDetail/${url.split('/').filter(Boolean).at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor: string;
            for (let run = true; run;) {
                const { data, cursor: { nextCursor } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/allComics?limit=100&after=${cursor}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `${slug}`, title));
                nextCursor ? cursor = nextCursor : run = false;
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/mangaDetail/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ slug, chapterNum }) => new Chapter(this, manga, slug, `Chapter ${chapterNum}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(`/chapter/${chapter.Identifier}`, this.URI);
        const token = await FetchWindowScript(new Request(chapterUrl), 'window.location.hash.slice(1)');

        const { data: { sessionId, axisKeys } } = await FetchJSON<APISession>(new Request(new URL(`./manga/img/session`, this.apiURL), {
            method: 'POST',
            body: JSON.stringify({ turnstile_token: token, chapter_slug: chapter.Identifier }),
            headers: {
                'Content-Type': 'application/json',
                Referer: this.URI.href,
                Origin: this.URI.origin
            }
        }));

        const store = new SealedStore();
        store.Init(axisKeys);

        const { data: { pageCount } } = await FetchJSON<APIPages>(new Request(new URL(`./manga/readingPage/${chapter.Identifier}`, this.apiURL)));

        return await Promise.all(Array.from({ length: pageCount }, async (_, pageIndex) => {
            return new Page(this, chapter, new URL(`${this.apiURL}manga/img/r/${await store.ComputePageUrlSegment(sessionId, chapter.Identifier, pageIndex)}`), { Referer: this.URI.href });
        }));

    }
}