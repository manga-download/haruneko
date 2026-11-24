import { Tags } from '../Tags';
import icon from './SafiCizgi.webp';
import { Fetch, FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { type Priority } from '../taskpool/TaskPool';
import { GetBytesFromBase64, GetUTF8FromBytes } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';
import { RandomInt } from '../Random';
import { XOR, HashUTF8 } from '../Crypto';

type HydratedManga = {
    id: string;
    title_turkish: string;
    title_english: string;
    slug: string;
};

type HydratedChapters = {
    chapters: {
        id: string;
        number: number;
        title: string;
    }[];
};

type APIPages = {
    images: {
        index: number;
        url: string;
    }[];
    heartbeatIntervalMs: number;
};

type MediaID = {
    id: string;
    slug: string;
};

type PageData = {
    index: number;
};

type DescramblingData = {
    a: number; // used in RNG function
    c: number; // number of columns
    h: number; // number of rows
    r: string; // used in scrambledBytes generation
    s: string; // used in scramblebyte generation and RNG
    ow: number; // JSON_imageWidth
    oh: number; // JSON_imageHeight
};

type HeartBeat = {
    interval: number;
    lastTime: number;
};

class PRNG {
    private combinedState: number;
    private scrambleChoice: number;

    constructor(seed: string, scrambleChoice: number) {
        this.scrambleChoice = scrambleChoice;
        let state1 = 0xDEADBEEF; // 3735928559
        let state2 = 1103547991;

        for (let t = 0; t < seed.length; t++) {
            let charCode = seed.charCodeAt(t);
            state1 = Math.imul(state1 ^ charCode, 2654435761);
            state2 = Math.imul(state2 ^ charCode, 1597334677);
        }

        switch (scrambleChoice % 4) {
            case 1:
                state1 = Math.imul(state1 ^ state1 >>> 15, 2246822507);
                state2 = Math.imul(state2 ^ state2 >>> 13, 3266489909);
                break;
            case 2:
                state1 = Math.imul(state1 ^ state1 >>> 16, 2146121005);
                state2 = Math.imul(state2 ^ state2 >>> 15, 2221713035);
                break;
            case 3:
                state1 = Math.imul(state1 ^ state1 << 5, 2654435761);
                state2 = Math.imul(state2 ^ state2 << 7, 2246822507);
                break;
            default:
                state1 = Math.imul(state1 ^ state1 >>> 16, 2246822507) ^ Math.imul(state2 ^ state2 >>> 13, 3266489909);
                state2 = Math.imul(state2 ^ state2 >>> 16, 2246822507) ^ Math.imul(state1 ^ state1 >>> 13, 3266489909);
        }

        this.combinedState = (state1 >>> 0) + (state2 >>> 0);
    }

    // Generates the next random number between 0 and 1
    #Next(): number {
        const multipliers = [1103515245, 1664525, 22695477, 134775813];
        const increments = [12345, 1013904223, 1, 1];

        let e = multipliers[this.scrambleChoice % 4];
        let r = increments[this.scrambleChoice % 4];

        this.combinedState = Math.imul(this.combinedState, e) + r;
        this.combinedState = this.combinedState & 0x7FFFFFFF; // Keep 31 bits
        return this.combinedState / 2147483648;
    }

    // Public method returning the desired tileOrder array
    public Sequence(scrambledBytes: number[], numCols: number, numRows: number): number[] {
        const tileOrder: number[] = [];
        const numTiles = numCols * numRows;
        let currentByteIndex = 0;

        const threshold = () => 0.3 + 0.4 * this.#Next();

        while (tileOrder.length < numTiles && currentByteIndex < scrambledBytes.length) {
            const t = threshold();
            if (this.#Next() > t && tileOrder.length < numTiles) {
                tileOrder.push(scrambledBytes[currentByteIndex]);
            } else {
                this.#Next();
            }
            currentByteIndex++;
        }

        while (tileOrder.length < numTiles && currentByteIndex < scrambledBytes.length) {
            tileOrder.push(scrambledBytes[currentByteIndex]);
            currentByteIndex++;
        }
        return tileOrder;
    }
}

export default class extends DecoratableMangaScraper {
    private readonly heartbeats = new Map<string, HeartBeat>();

    private readonly apiURL = 'https://saficizgi.com/api/';

    public constructor() {
        super('saficizgi', 'Safi Çizgi', 'https://saficizgi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
        this.imageTaskPool.RateLimit = new RateLimit(4, 2);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/seri/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const { id, slug, title_turkish: titleTurkish, title_english: titleEnglish } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'title_turkish' in data && data['slug'] === mangaUrl.pathname.split('/').at(-1));
        return new Manga(this, provider, JSON.stringify({ slug, id }), titleTurkish || titleEnglish);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        //const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./pb/api/collections/manga/records?page=1&perPage=1000`, this.apiURL)));
        //return items.map(({ id, slug, title_turkish: titleTurkish, title_english: titleEnglish }) => new Manga(this, provider, JSON.stringify({ slug, id }), titleTurkish || titleEnglish));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { slug: mangaSlug } = <MediaID>JSON.parse(manga.Identifier);
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(`./seri/${mangaSlug}`, this.URI)), data => 'chapters' in data && Array.isArray(data['chapters']));
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, JSON.stringify({ slug: `${number}`, id }), ['Bölüm', number, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { id: chapterID, slug: chapterSlug } = <MediaID>JSON.parse(chapter.Identifier);
        const { slug: mangaSlug } = <MediaID>JSON.parse(chapter.Parent.Identifier);

        //fetch in browser because of anti bot
        const { images, heartbeatIntervalMs } = await FetchWindowScript<APIPages>(new Request(new URL(`/oku/${mangaSlug}/${chapterSlug}`, this.URI)), `
            new Promise(async (resolve, reject) => {
                try {
                    await fetch('/api/reader/session?chapterId=${chapterID}',{
                        credentials: "same-origin",
                        cache: "no-store"
                    });

                    const response = await fetch('/api/reader/manifest/${chapterID}?from=0&count=9999&machine=0', {
                        credentials: "same-origin",
                        cache: "no-store"
                    });

                    const data = await response.json();
                    resolve(data);
                } catch(error) {
                    reject(error);
                }
            });
        `);

        this.heartbeats.set(chapterID, { interval: heartbeatIntervalMs, lastTime: Date.now() });
        return images.map(({ url, index }) => new Page(this, chapter, new URL(url, this.URI), { index }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const { id: chapterId } = <MediaID>JSON.parse(page.Parent.Identifier);
            if (this.heartbeats.get(chapterId)) {
                const { interval, lastTime } = this.heartbeats.get(chapterId);
                if (Date.now() > interval + lastTime) {
                    await this.SendHeartBeat(chapterId, page.Parameters.index);
                }
            }

            const response = await Fetch(new Request(page.Link, {
                headers: {
                    Referer: this.URI.href
                }
            }));
            const armor = response.headers.get('X-Safi-Armor');
            if (!armor) return response.blob();

            const salt = page.Link.href.match(/\/api\/v\/[^/]+\/([^/]+)/).at(1);
            const encrypted = GetBytesFromBase64(armor);
            const hash = new Uint8Array(await HashUTF8('SHA-256', `${salt}${decodeURIComponent(page.Link.pathname.split('/').at(-1))}`));

            const decrypted = GetUTF8FromBytes(this.XOR(encrypted, hash));
            const { s, r, c: numCols, h: numRows, a: scrambleChoice, ow, oh } = <DescramblingData>JSON.parse(decrypted);
            const blob = await GetTypedData(this.XOR(new Uint8Array(await response.arrayBuffer()), hash).buffer);

            return DeScramble(blob, async (image, ctx) => {
                const scrambledBytes = Array.from(this.XOR(GetBytesFromBase64(r), s).slice(2));
                const tileOrder = new PRNG(s + 'safi_v8_poly', scrambleChoice).Sequence(scrambledBytes, numCols, numRows);

                const tileWidth = Math.floor(image.width / numCols);
                const tileHeight = Math.floor(image.height / numRows);

                const JSON_imageWidth = ow || 0;// imageHeight
                const JSON__imageHeight = oh || 0;//__imageWidth

                ctx.canvas.width = JSON_imageWidth || image.width;
                ctx.canvas.height = JSON__imageHeight || image.height;

                for (let tileIndex = 0; tileIndex < numCols * numRows; tileIndex++) {
                    const sourceTileIndex = tileOrder[tileIndex];
                    const srcX = sourceTileIndex % numCols * tileWidth;
                    const srcY = Math.floor(sourceTileIndex / numCols) * tileHeight;
                    const destX = tileIndex % numCols * tileWidth;
                    const destY = Math.floor(tileIndex / numCols) * tileHeight;
                    ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, destX, destY, tileWidth, tileHeight);
                }
            });
        }, priority, signal);
    }

    private async SendHeartBeat(chapterId: string, pageIndex: number): Promise<void> {
        const safePageIndex = Math.max(0, pageIndex);

        // Realistic viewport height (e.g., typical desktop/tablet height)
        const viewportHeight = RandomInt(800, 1080);

        // Each page contributes ~0.8x–1.15x of the viewport height, plus ~120–240px header/footer buffer
        const pagesToShow = safePageIndex + 1;
        const avgPageSpan = viewportHeight * (RandomInt(80, 115) / 100);
        const documentHeight = Math.max(
            viewportHeight + RandomInt(100, 250),
            Math.round(pagesToShow * avgPageSpan + RandomInt(120, 240))
        );

        // Progress scrollY smoothly across the document as pageIndex increases, with small human-like jitter
        const maxScrollY = Math.max(0, documentHeight - viewportHeight);
        const totalSteps = Math.max(1, safePageIndex + 1);
        const progressRatio = Math.min(1, safePageIndex / totalSteps + RandomInt(15, 75) / 100);
        const jitter = RandomInt(-30, 30);
        const scrollY = Math.min(
            maxScrollY,
            Math.max(0, Math.round(maxScrollY * progressRatio + jitter))
        );

        await FetchJSON(new Request(new URL('./reader/heartbeat', this.apiURL), {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store',
            body: JSON.stringify({
                chapterId,
                documentHeight,
                focused: true,
                pageIndex: safePageIndex,
                scrollY,
                viewportHeight,
                visibleFrom: safePageIndex,
                visibleTo: safePageIndex
            }),
            headers: {
                'Content-Type': 'application/json',
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'Sec-Fetch-Site': 'same-origin'
            }
        }));

        const heartbeat = this.heartbeats.get(chapterId);
        if (heartbeat) {
            heartbeat.lastTime = Date.now();
        }
    }

    private XOR(data: Uint8Array, key: Uint8Array | string): Uint8Array<ArrayBuffer> {
        const computeKey = (keyData: String) => {
            const result = new Uint8Array(32);
            let hash = 5381;
            for (let t = 0; t < keyData.length; t++) hash = ((hash << 5) + hash ^ keyData.charCodeAt(t)) >>> 0;

            for (let i = 0; i < 32; i++) {
                hash = (hash << 5) + hash ^ 31 * i + 7;
                hash >>>= 0;
                result[i] = hash >>> i % 4 * 7 & 0xff;
            }
            return result;
        };
        const keyBytes: Uint8Array = key instanceof Uint8Array ? key : computeKey(key as string);
        return XOR(data, keyBytes);
    }
}