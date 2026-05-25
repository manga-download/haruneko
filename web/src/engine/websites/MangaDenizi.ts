import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIManga = {
    data: {
        manga: {
            title: string;
            slug: string;
            chapters: APIChapter[];
        };
    }
};

type APIMangas = {
    data: {
        manga: {
            data: {
                title: string;
                slug: string;
            }[];
        };
    }
};

type APIChapter = {
    slug: string;
    number: number;
    title: string;
};

type APIPages = {
    pages: {
        image_url: string;
        scramble: ScrambleData;
    }[];
};

type ScrambleData = {
    method: string;
    grid: number;
    seed: number;
};

type Region = {
    offset: number;
    length: number;
};

export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/v1/web/ `;

    public constructor() {
        super('mangadenizi', 'Manga Denizi', 'https://mangadenizi.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { manga: { title, slug } } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { manga: { data } } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?page=${page}`, this.apiURL)));
                const mangas = data.map(({ title, slug }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { manga: { chapters } } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ slug, number, title }) => new Chapter(this, manga, slug, ['Bölüm', number, title ? '-' : '', title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleData>[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./read/${chapter.Parent.Identifier}/${chapter.Identifier}/payload`, this.apiURL)));
        return pages.map(({ image_url: url, scramble }) => new Page<ScrambleData>(this, chapter, new URL(url), { ...scramble }));
    };

    public override async FetchImage(page: Page<ScrambleData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const response = await Fetch(new Request(page.Link));
            let { method, grid, seed } = page.Parameters;

            if (!method) {
                method = response.headers.get('X-Scramble-Method') || response.headers.get('X-Scrambled-Method') || 'none';
                grid = parseInt(response.headers.get('X-Scramble-Grid'));
                seed = parseInt(response.headers.get('X-Scramble-Seed'));
            };

            switch (method) {
                case 'none': {
                    return GetTypedData(await response.arrayBuffer());
                }
                case 'xor': {
                    const key = parseInt(response.headers.get('X-Scramble-Key'), 10);
                    const buffer = await response.arrayBuffer();
                    return GetTypedData(this.XOR(new Uint8Array(buffer), key));
                }
                case 'tiled-v1': {
                    const blob = await response.blob();
                    return DeScramble(blob, async (image, ctx) => {

                        const ToUint32 = (value: number) => value >>> 0;
                        const DEFAULT_PRNG_SEED = 0x9E3779B9;

                        const DeriveSeed = (baseSeed: number, salt: number) => ToUint32(ToUint32(baseSeed) ^ ToUint32(salt) || DEFAULT_PRNG_SEED);

                        const CreateXorshift32 = (seed: number) => {
                            let state = ToUint32(seed) || DEFAULT_PRNG_SEED;
                            return () => (
                                state = ToUint32(state ^ ToUint32(state << 13)),
                                state = ToUint32(state ^ state >>> 17),
                                state = ToUint32(state ^ ToUint32(state << 5)),
                                state
                            );
                        };

                        const GenerateShuffledIndices = (count: number, seed: number) => {
                            const indices = Array.from({ length: Math.max(1, count) }, (_, index) => index);
                            const random = CreateXorshift32(seed);
                            for (let current = indices.length - 1; current > 0; current -= 1) {
                                const randomIndex = random() % (current + 1);
                                [indices[current], indices[randomIndex]] =
                                    [indices[randomIndex], indices[current]];
                            }
                            return indices;
                        };

                        const CreateSeededPermutation = (count: number, seed: number) => GenerateShuffledIndices(Math.max(1, count), seed);

                        const SplitDimensionIntoRegions = (totalSize: number, regionCount: number): Region[] => {
                            const size = Math.max(1, Math.floor(totalSize));
                            const count = Math.max(1, Math.min(Math.floor(regionCount) || 1, size));
                            return Array.from({ length: count }, (_, regionIndex) => {
                                const startOffset = Math.floor(regionIndex * size / count);
                                const endOffset = Math.floor((regionIndex + 1) * size / count);
                                return {
                                    offset: startOffset,
                                    length: Math.max(1, endOffset - startOffset)
                                };
                            });
                        };

                        const X_AXIS_SHUFFLE_SALT = 0x85EBCA6B;
                        const Y_AXIS_SHUFFLE_SALT = 0X9E3779B9;

                        const canvasWidth = Math.max(1, Math.floor(image.width));
                        const canvasHeight = Math.max(1, Math.floor(image.height));
                        const gridSize = Math.max(1, Math.min(Math.floor(grid) || 1, canvasWidth, canvasHeight));
                        const columnRegions = SplitDimensionIntoRegions(canvasWidth, gridSize);
                        const rowRegions = SplitDimensionIntoRegions(canvasHeight, gridSize);
                        const shuffledColumns = CreateSeededPermutation(gridSize, DeriveSeed(seed, X_AXIS_SHUFFLE_SALT));
                        const shuffledRows = CreateSeededPermutation(gridSize, DeriveSeed(seed, Y_AXIS_SHUFFLE_SALT));

                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                        for (let row = 0; row < gridSize; row += 1) {
                            const destinationRow = rowRegions[shuffledRows[row]];
                            const sourceRow = rowRegions[row];

                            for (let column = 0; column < gridSize; column += 1) {
                                const destinationColumn = columnRegions[shuffledColumns[column]];
                                const sourceColumn = columnRegions[column];
                                ctx.drawImage(
                                    image,
                                    sourceColumn.offset, sourceRow.offset,
                                    sourceColumn.length, sourceRow.length,
                                    destinationColumn.offset, destinationRow.offset,
                                    destinationColumn.length, destinationRow.length
                                );
                            }
                        }
                    });
                }
            }
        }, priority, signal);
    }

    private XOR(sourceArray: Uint8Array, key: number) {
        const result = new Uint8Array(sourceArray.length);
        for (let index = 0; index < sourceArray.length; index++)
            result[index] = sourceArray[index] ^ key;
        return result.buffer;
    }
}