import { Tags } from '../Tags';
import icon from './SekaiKomik.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';

// TODO: Extract Serialize & Deserialize to a separate file

type PackedData = {
    nodes: {
        data: JSONElement;
    }[];
};

type APIMangas = {
    mangas: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapters = {
    chapters: APIChapter[];
};

type APIChapter = {
    id: string;
    chapterNumber: number;
    pages: {
        url: string;
    }[]
};

function CleanTitle(title: string): string {
    return title.replaceAll(/(Bahasa Indonesia|^(.*) Hentai\s*\|)/g, '').trim();
}

@Common.PagesSinglePageJS(`[...document.querySelectorAll('img[alt*="Page"')].map(img => img.src);`, 1500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('sekaikomik', 'ManhwaLand (SekaiKomik)', 'https://02x.mwland.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/komik/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const [title] = await FetchRegex(new Request(new URL(url)), /manga:\{[^}]*?title:"([^"]*)"/g);
        return new Manga(this, provider, mangaUrl.pathname.split('/').at(-1), CleanTitle(title));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: mangasData } = await this.FetchAPI<APIMangas>(`/daftar-komik/__data.json?page=${page}`);
                const mangas = mangasData.map(({ slug, title }) => new Manga(this, provider, slug, CleanTitle(title)));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let skip = 0, run = true; run;) {
                const { chapters: chaptersData } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}/chapters?skip=${skip}`, this.apiUrl)));
                const chapters = chaptersData.map(({ chapterNumber }) => new Chapter(this, manga, `/baca/${manga.Identifier}/${chapterNumber}`, `Chapter ${chapterNumber}`));
                chapters.length > 0 ? yield* chapters : run = false;
                skip += chapters.length;
            }
        }.call(this))).distinct();
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const { nodes } = await FetchJSON<PackedData>(new Request(new URL(endpoint, this.URI)));
        return this.Deserialize<T>(nodes[1].data);
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
            if (value === -4) return Infinity;
            if (value === -5) return - Infinity;
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
