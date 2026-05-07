import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetURLBase64FromBytes } from '../BufferEncoder';

// TODO: Extract Serialize & Deserialize to a separate file

type JSONSvelte = {
    nodes: {
        type: string;
        data: JSONElement;
    }[];
};

type APIResult = {
    result: string;
};

type APIManga = {
    name: string;
    slug: string;
    seasons: {
        chapters: APIChapter[];
    }[];
};

type JSONManga = {
    serie: APIManga;
};

type APIChapter = {
    id: number;
    number: number;
    images: string[];
};

type JSONChapter = {
    currentChapter: APIChapter;
};

type APIMangas = {
    data: APIManga[];
    next_cursor: string;
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'title', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.split('|').at(0).trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://visorjpg.lat/_app/remote/xkl77u/';

    public constructor() {
        super('lectorjpg', 'VisorJPG', 'https://visorjpg.lat', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        let cursor: string = undefined;
        return Array.fromAsync(async function* (this: This) {
            for (let run = true; run;) {
                const { data, next_cursor } = await this.FetchAPI<APIMangas>('./getSeries', {
                    cursor,
                    genres: [],
                    name: '',
                    perPage: 500
                });
                const mangas = data.map(({ slug, name }) => new Manga(this, provider, slug, name));
                yield* mangas;
                run = !!next_cursor;
                cursor = next_cursor;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { nodes } = await FetchJSON<JSONSvelte>(new Request(new URL(`/series/${manga.Identifier}/__data.json`, this.URI)));
        const { serie: { seasons } } = this.Deserialize<JSONManga>(nodes[1].data);
        return seasons.reduce((accumulator: Chapter[], season) => {
            const chapters = season.chapters.map(({ id, number }) => new Chapter(this, manga, `${id}`, `Capitulo ${number}`));
            return accumulator.concat(chapters);
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { nodes } = await FetchJSON<JSONSvelte>(new Request(new URL(`/read/${chapter.Parent.Identifier}/${chapter.Identifier}/__data.json`, this.URI)));
        const { currentChapter: { images } } = this.Deserialize<JSONChapter>(nodes[1].data);
        return images.map(image => new Page(this, chapter, new URL(image)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, payload: JSONElement): Promise<T> {
        const url = new URL(endpoint, this.apiUrl);
        url.searchParams.set('payload', this.EncodePayload(payload));
        const { result } = await FetchJSON<APIResult>(new Request(url));
        return this.Deserialize<T>(result);
    }

    private EncodePayload(payload: JSONElement): string {
        const serialized = this.Serialize(payload);
        return GetURLBase64FromBytes(new TextEncoder().encode(serialized));
    }

    private Serialize(input: JSONElement): string {
        const objects = new Map<JSONElement, number>(); // tracks seen objects/arrays
        const output: JSONElement[] = [];

        const encode = (value: JSONElement): number | JSONElement => {
            if (value === void 0) return -1;
            if (Number.isNaN(value)) return -3;
            if (value === 1 / 0) return -4;
            if (value === - 1 / 0) return -5;
            if (value === 0 && 1 / value < 0) return -6;

            // Primitives
            if (value === null || typeof value === 'boolean' || typeof value === 'string') {
                output.push(value);
                return output.length - 1;
            }

            if (typeof value === 'number') {
                output.push(value);
                return output.length - 1;
            }

            // Already seen: return its index
            if (objects.has(value)) {
                return objects.get(value)!;
            }

            // Arrays
            if (Array.isArray(value)) {
                const index = output.length;
                objects.set(value, index);

                const arr: JSONArray = new Array(value.length);
                output.push(arr); // placeholder
                for (let i = 0; i < value.length; i++) {
                    const item = value[i];
                    arr[i] = encode(item);
                }
                return index;
            }

            // Objects
            if (typeof value === 'object') {
                const index = output.length;
                objects.set(value, index);

                const obj: JSONObject = {};
                output.push(obj); // placeholder
                for (const key in value) {
                    if (key === '__proto__') {
                        throw new Error('Cannot serialize object with __proto__ property');
                    }
                    obj[key] = encode((value as JSONObject)[key]);
                }
                return index;
            }

            throw new Error('Unsupported value type');
        };

        // Start encoding at the root object
        encode(input);

        // Return JSON string
        return JSON.stringify(output);
    }

    private Deserialize<T extends JSONElement>(input: string | JSONElement): T {
        const parsed = typeof input === 'string' ? JSON.parse(input) : input;

        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error('Parsed input must be a non-empty array');
        }

        const cache: JSONElement[] = new Array(parsed.length);

        const revive = (index: number): JSONElement => {
            if (index in cache) return cache[index];

            const value = parsed[index];

            if (value === -1) return undefined;
            if (value === -3) return NaN;
            if (value === -4) return 1 / 0;
            if (value === -5) return - 1 / 0;
            if (value === -6) return - 0;

            // Primitive values
            if (value === null || typeof value === 'boolean' || typeof value === 'string') {
                cache[index] = value;
                return value;
            }

            if (typeof value === 'number') {
                cache[index] = value;
                return value;
            }

            // Arrays
            if (Array.isArray(value)) {
                const arr: JSONArray = new Array(value.length);
                cache[index] = arr;
                for (let i = 0; i < value.length; i++) {
                    const item = value[i];
                    arr[i] = typeof item === 'number' ? revive(item) : item as JSONElement;
                }
                return arr;
            }

            // Objects
            if (typeof value === 'object' && value !== null) {
                const obj: JSONObject = {};
                cache[index] = obj;
                for (const key in value) {
                    if (key === '__proto__') throw new Error('Cannot parse object with __proto__ property');
                    const v = value[key];
                    obj[key] = typeof v === 'number' ? revive(v) : v as JSONElement;
                }
                return obj;
            }

            throw new Error('Invalid value encountered during deserialization');
        };
        return revive(0) as T;
    }
}