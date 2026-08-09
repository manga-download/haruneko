import { Tags } from '../Tags';
import icon from './PixivComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';
import { GetHexFromBytes, GetBytesFromUTF8 } from '../BufferEncoder';

type APIResult<T> = {
    data: T;
};

type APIMangaPage = {
    magazines: { id: number; }[];
};

type APIManga = {
    official_work: {
        id: number;
        name: string;
    };
};

type APIMangas = {
    official_works: {
        id: number;
        title: string;
    }[];
};

type APIChapters = {
    episodes: {
        readable: boolean;
        episode: {
            id: number;
            numbering_title: string;
            sub_title: string;
        };
    }[];
};

type ChapterSalt = {
    props: {
        pageProps: {
            salt: string;
        };
    };
};

type APIPages = {
    reading_episode: {
        pages: APIPage[];
    };
};

type APIPage = {
    url: string;
    key: string;
    gridsize: number;
    width: number;
    height: number;
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comic.pixiv.net/api/app/';

    public constructor() {
        super('pixivcomics', `pixivコミック`, 'https://comic.pixiv.net', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/works/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { official_work: { id, name } } = await this.FetchAPI<APIManga>(`./works/v5/${new URL(url).pathname.match(/\d+$/).at(0)}`);
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { magazines } = await this.FetchAPI<APIMangaPage>('./magazines');
        const pages = magazines.map(({ id }) => id);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (const page of pages) {
                const { official_works } = await this.FetchAPI<APIMangas>(`./magazines/v2/${page}/works`);
                const mangas = official_works.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { episodes } = await this.FetchAPI<APIChapters>(`./works/${manga.Identifier}/episodes?page=${page}`);
                const chapters = episodes.filter(({ readable }) => readable)
                    .map(({ episode: { id, numbering_title: numberTitle, sub_title: subTitle } }) => {
                        return new Chapter(this, manga, `${id}`, numberTitle + (!subTitle ? '' : ' - ' + subTitle));
                    });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [{ text }] = await FetchCSS<HTMLScriptElement>(new Request(new URL(`/viewer/stories/${chapter.Identifier}`, this.URI)), 'script#__NEXT_DATA__');
        const { props: { pageProps: { salt } } } = <ChapterSalt>JSON.parse(text);
        const { reading_episode: { pages } } = await this.FetchAPI<APIPages>(`./episodes/${chapter.Identifier}/read_v4`, salt);
        return pages.map(image => new Page<APIPage>(this, chapter, new URL(image.url), { ...image }));
    }

    public override async FetchImage(page: Page<APIPage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { width, height, key, gridsize } = page.Parameters;
        const blob = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                method: 'GET',
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.href,
                    Accept: '*/*',
                    'X-Cobalt-Thumber-Parameter-GridShuffle-Key': key
                }
            }));
            return response.blob();
        }, priority, signal);

        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const scrambled = ctx.getImageData(0, 0, width, height).data;
            const descrambled = await this.DescrambleData(scrambled, 4, width, height, gridsize, gridsize, '4wXCKprMMoxnyJ3PocJFs4CYbfnbazNe', key, true);
            ctx.putImageData(new ImageData(descrambled, width, height), 0, 0);
        });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, salt: string = undefined): Promise<T> {
        const timestamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'X-Requested-With': 'pixivcomic',
                Referer: this.URI.href,
                ...salt && {
                    'X-Client-Time': timestamp,
                    'X-Client-Hash': GetHexFromBytes(new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(timestamp + salt)))),
                }
            }
        }))).data;
    }

    private async DescrambleData(scrambledData: Uint8ClampedArray, bytesPerPixel: number, width: number, height: number, columnSize: number,
        rowSize: number, salt: string, key: string, reverse: boolean): Promise<Uint8ClampedArray<ArrayBuffer>> {

        const rowGroups = Math.ceil(height / rowSize);
        const columns = Math.floor(width / columnSize);

        const shuffleTable = Array.from({ length: rowGroups }, () => Array.from({ length: columns }, (_, i) => i));
        const seed = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(salt + key));
        const random = new PRNG(new Uint32Array(seed, 0, 4));

        for (let i = 0; i < 100; i++) random.Next();

        for (let rowGroup = 0; rowGroup < rowGroups; rowGroup++) {
            const order = shuffleTable[rowGroup];
            for (let i = columns - 1; i > 0; i--) {
                const j = random.Next() % (i + 1);
                [order[i], order[j]] = [order[j], order[i]];
            }
        }

        if (reverse) {
            for (let rowGroup = 0; rowGroup < rowGroups; rowGroup++) {
                const order = shuffleTable[rowGroup];
                const inverse = order.map((_, i) => order.indexOf(i));
                if (inverse.some(index => index < 0)) {
                    throw new Error("Failed to reverse shuffle table");
                }
                shuffleTable[rowGroup] = inverse;
            }
        }

        const output = new Uint8ClampedArray(scrambledData.length);
        for (let y = 0; y < height; y++) {
            const rowGroup = Math.floor(y / rowSize);
            const columnOrder = shuffleTable[rowGroup];

            for (let destinationColumn = 0; destinationColumn < columns; destinationColumn++) {
                const sourceColumn = columnOrder[destinationColumn];

                const destinationX = destinationColumn * columnSize;
                const sourceX = sourceColumn * columnSize;

                const destinationOffset = (y * width + destinationX) * bytesPerPixel;
                const sourceOffset = (y * width + sourceX) * bytesPerPixel;

                const bytesToCopy = columnSize * bytesPerPixel;

                for (let i = 0; i < bytesToCopy; i++) {
                    output[destinationOffset + i] = scrambledData[sourceOffset + i];
                }
            }

            const remainderStartX = columns * columnSize;
            const remainderStart = (y * width + remainderStartX) * bytesPerPixel;
            const rowEnd = (y * width + width) * bytesPerPixel;

            for (let i = remainderStart; i < rowEnd; i++) {
                output[i] = scrambledData[i];
            }
        }
        return output;
    }
}

//32 bit variant of xoroshiro128 PRNG
class PRNG {

    private readonly state = new Uint32Array(4);

    public Next() {
        const result = 9 * this.RotateLeft(5 * this.state[1] >>> 0, 7) >>> 0;
        const temp = this.state[1] << 9 >>> 0;
        this.state[2] = (this.state[2] ^ this.state[0]) >>> 0;
        this.state[3] = (this.state[3] ^ this.state[1]) >>> 0;
        this.state[1] = (this.state[1] ^ this.state[2]) >>> 0;
        this.state[0] = (this.state[0] ^ this.state[3]) >>> 0;
        this.state[2] = (this.state[2] ^ temp) >>> 0;
        this.state[3] = this.RotateLeft(this.state[3], 11);
        return result;
    }

    constructor(seed: Uint32Array) {
        this.state = new Uint32Array(seed);

        const allZeros =
            this.state[0] === 0 &&
            this.state[1] === 0 &&
            this.state[2] === 0 &&
            this.state[3] === 0;

        if (allZeros) this.state[0] = 1;
    }

    private RotateLeft(value: number, shift: number) {
        return (value << (shift %= 32) >>> 0 | value >>> 32 - shift) >>> 0;
    }
}