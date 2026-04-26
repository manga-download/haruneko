import { Tags } from '../Tags';
import icon from './SafiCizgi.webp';
import { Fetch, FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { type Priority } from '../taskpool/TaskPool';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APICollection<T> = {
    items: T[];
};

type APIManga = {
    id: string;
    slug: string;
    title_english: string;
    title_turkish: string;
};

type APIChapter = {
    id: string;
    number: number;
    title: string;
    pages: string[];
};

type HydradedPages = {
    chapter: APIChapter;
    hourlySalt: string;
    viewerToken: string;
};

type MediaID = {
    slug: string;
    id: string;
};

type PageData = {
    salt: string;
};

type DescramblingData = {
    c: number; // number of columns
    h: number; // number of rows
    r: string; // used in scrambledBytes generation
    s: string; // used in scramblebyte generation and RNG
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://saficizgi.com/api/';

    public constructor() {
        super('saficizgi', 'Safi Çizgi', 'https://saficizgi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/seri/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const filter = encodeURIComponent(`slug = "${url.split('/').at(-1)}"`);
        const [{ items: [{ id, slug, title_turkish: titleTurkish, title_english: titleEnglish }] }] = [await FetchJSON<APICollection<APIManga>>(
            new Request(new URL(`./pb/api/collections/manga/records?filter=${filter}`, this.apiUrl))
        )];
        return new Manga(this, provider, JSON.stringify({ slug, id }), titleTurkish || titleEnglish);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { items } = await FetchJSON<APICollection<APIManga>>(new Request(new URL(`./pb/api/collections/manga/records?page=1&perPage=1000`, this.apiUrl)));
        return items.map(({ id, slug, title_turkish: titleTurkish, title_english: titleEnglish }) => new Manga(this, provider, JSON.stringify({ slug, id }), titleTurkish || titleEnglish));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id: mangaId }: MediaID = JSON.parse(manga.Identifier);
        const filter = encodeURIComponent(`manga_id = "${mangaId}"`);
        const { items } = await FetchJSON<APICollection<APIChapter>>(new Request(new URL(`./pb/api/collections/chapters/records?page=1&perPage=1000&filter=${filter}`, this.apiUrl)));
        return items.map(({ id, number, title }) => new Chapter(this, manga, JSON.stringify({ slug: `${number}`, id }), [`Bölüm ${number}`, title].filter(Boolean).join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { id: chapterId, slug: chapterSlug }: MediaID = JSON.parse(chapter.Identifier);
        const { slug: mangaSlug }: MediaID = JSON.parse(chapter.Parent.Identifier);

        //const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./pb/api/collections/chapters/records/${chapterId}`, this.apiUrl)));

        const { hourlySalt, viewerToken, chapter: { pages } } = await FetchNextJS<HydradedPages>(new Request(new URL(`/oku/${mangaSlug}/${chapterSlug}`, this.URI)), data => 'viewerToken' in data);
        const salt = hourlySalt.substring(0, 8);
        return pages.map(page => new Page<PageData>(this, chapter, new URL(`./v/${chapterId}/${salt}/${page}?token=${encodeURIComponent(viewerToken)}`, this.apiUrl), { salt }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const hash = await this.GetXorKey(page.Parameters.salt, decodeURIComponent(page.Link.pathname.split('/').at(-1)));
            const response = await Fetch(new Request(page.Link, {
                headers: {
                    Referer: this.URI.href
                }
            }));
            const encrypted = GetBytesFromBase64(response.headers.get('X-Safi-Armor'));
            const decrypted = new TextDecoder().decode(this.XOR(encrypted, hash));
            const { s, r, c: numCols, h: numRows }: DescramblingData = JSON.parse(decrypted);
            const blob = await GetTypedData(this.XOR(new Uint8Array(await response.arrayBuffer()), hash).buffer);

            return DeScramble(blob, async (image, ctx) => {
                const scrambledBytes = Array.from(this.XOR(GetBytesFromBase64(r), GetBytesFromHex(s)).slice(2));
                const tileOrder = [];
                const generator = GetRNGenerator(s + 'safi_v7_shield');
                const numTiles = numCols * numRows;
                let currentByteIndex = 0;

                while (tileOrder.length < numTiles && currentByteIndex < scrambledBytes.length) {
                    if (generator() > 0.5 && tileOrder.length < numTiles) {
                        tileOrder.push(scrambledBytes[currentByteIndex]);
                    } else {
                        generator();
                    }
                    currentByteIndex++;
                }

                while (tileOrder.length < numTiles && currentByteIndex < scrambledBytes.length) {
                    tileOrder.push(scrambledBytes[currentByteIndex]);
                    currentByteIndex++;
                }

                const tileWidth = Math.floor(image.width / numCols);
                const tileHeight = Math.floor(image.height / numRows);
                ctx.canvas.width = tileWidth * numCols;
                ctx.canvas.height = tileHeight * numRows;

                for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
                    const sourceTileIndex = tileOrder[tileIndex];
                    const srcX = sourceTileIndex % numCols * tileWidth;
                    const srcY = Math.floor(sourceTileIndex / numCols) * tileHeight;
                    const destX = tileIndex % numCols * tileWidth;
                    const destY = Math.floor(tileIndex / numCols) * tileHeight;
                    ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, destX, destY, tileWidth, tileHeight);
                }

                function GetRNGenerator(seed: string): Function {
                    let state1 = 3735928559;
                    let state2 = 1103547991;

                    for (let i = 0; i < seed.length; i++) {
                        const charCode = seed.charCodeAt(i);
                        state1 = Math.imul(state1 ^ charCode, 2654435761);
                        state2 = Math.imul(state2 ^ charCode, 1597334677);
                    }

                    state1 = Math.imul(state1 ^ state1 >>> 16, 2246822507) ^ Math.imul(state2 ^ state2 >>> 13, 3266489909);
                    state2 = Math.imul(state2 ^ state2 >>> 16, 2246822507) ^ Math.imul(state1 ^ state1 >>> 13, 3266489909);

                    let state = (state1 >>> 0) + (state2 >>> 0);
                    return function () {
                        state = Math.imul(state, 1103515245) + 12345 & 0x7fffffff;
                        return state / 2147483647;
                    };
                }
            });
        }, priority, signal);
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const { slug: mangaSlug }: MediaID = JSON.parse(chapter.Parent.Identifier);
        const { slug: chapterSlug }: MediaID = JSON.parse(chapter.Identifier);
        return new URL(`/oku/${mangaSlug}/${chapterSlug}`, this.URI);
    }

    private XOR(data: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
        return data.map((byte, index) => byte ^ key[index % key.length]);
    }

    private async GetXorKey(salt: string, pageName: string): Promise<Uint8Array> {
        return new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(`${salt}${pageName}`)));
    }

}