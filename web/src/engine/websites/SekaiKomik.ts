import { Tags } from '../Tags';
import icon from './SekaiKomik.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';

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

    Deserialize<T extends JSONElement>(data: JSONElement): T {
        if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid input');

        const inputArray = data;
        const processedData = Array(inputArray.length);

        function processValue(value: any) {
            if (value === -1) return;
            if (value === -3) return NaN;
            if (value === -4) return Infinity;
            if (value === -5) return -Infinity;
            if (value === -6) return -0;

            if (value in processedData) return processedData[value];

            const item = inputArray[value];
            if (!item || typeof item !== 'object') {
                processedData[value] = item;
            } else if (Array.isArray(item)) {
                if (typeof item[0] === 'string') {
                    const type = item[0];
                    switch (type) {
                        case 'Object':
                            const obj = Object(item[1]);
                            if (Object.hasOwn(obj, '__proto__')) throw new Error('Cannot parse an object with a `__proto__` property');
                            processedData[value] = obj;
                            break;
                        default:
                            processedData[value] = undefined;
                    }
                } else {
                    const array = new Array(item.length);
                    processedData[value] = array;
                    for (let i = 0; i < item.length; i++) {
                        const element = item[i];
                        if (element !== -2) {
                            array[i] = processValue(element);
                        }
                    }
                }
            } else {
                const object = {};
                processedData[value] = object;
                for (const key of Object.keys(item)) {
                    if (key === '__proto__') throw new Error('Cannot parse an object with a `__proto__` property');
                    const element = item[key];
                    object[key] = processValue(element);
                }
            }
            return processedData[value];
        }
        return processValue(0) as T;
    }
}
