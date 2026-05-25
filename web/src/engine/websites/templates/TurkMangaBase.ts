// TurkManga : arbitrary name for turkish websites using NEXTJS chunks and series_items deshydrated page list

import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type JSONSvelte = {
    nodes: {
        type: string;
        data: JSONElement;
    }[];
};

type APIMangas = {
    series: APIManga[];
};

type APIManga = {
    id: number;
    slug: string;
    name: string;
};

type APIChapters = {
    series: {
        SeriesEpisode: {
            order: number;
            slug: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav span', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.PagesSinglePageCSS('div.manga-reader-container div.ep-item img')
@Common.ImageAjax()
export class TurkMangaBase extends DecoratableMangaScraper {

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { nodes } = await FetchJSON<JSONSvelte>(new Request(new URL(`/manga/__data.json?page=${page}`, this.URI)));
                const { series } = this.Deserialize<APIMangas>(nodes[2].data);
                const mangas = series.map(({ slug, name }) => new Manga(this, provider, slug, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { nodes } = await FetchJSON<JSONSvelte>(new Request(new URL(`/manga/${manga.Identifier}/__data.json`, this.URI)));
        const { series: { SeriesEpisode } } = this.Deserialize<APIChapters>(nodes[2].data);
        return SeriesEpisode.map(({ slug, order }) => new Chapter(this, manga, `/manga/${manga.Identifier}/${slug}`, `Bölüm ${order}`));
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
            if (value === -5) return -Infinity;
            if (value === -6) return -0;

            // Primitive values
            if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'string') {
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