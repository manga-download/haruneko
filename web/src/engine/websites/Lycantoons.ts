import { Tags } from '../Tags';
import icon from './Lycantoons.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    id: string;
    title: string;
    slug: string;
};

type APIMangas = {
    series: APIManga[];
};

type APIChapters = {
    chapters: {
        id: number;
        numero: number;
        title: string;
    }[];
};

@Common.PagesSinglePageJS(`[...document.querySelectorAll('[data-page-idx] img')].map(img => img.src);`, 1500)
@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('lycantoons', 'Lycantoons', 'https://lycantoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [{ content }] = await FetchCSS<HTMLMetaElement>(new Request(new URL(url), {
            headers: {
                Referer: this.URI.href,
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin'
            },
        }), 'meta[property="og:title"]');
        return new Manga(this, provider, url.split('/').at(-1), content.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { series } = await this.FetchAPI<APIMangas>('./series', { search: '', limit: 60, page });
                const mangas = series.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./series/${manga.Identifier}/chapters`, undefined,
            new URL(`/series/${manga.Identifier}`, this.URI).href);
        return chapters.map(({ numero, title }) => new Chapter(this, manga, `/series/${manga.Identifier}/${numero}`, [`Cap. ${numero}`, title].joinTitleSegments()));
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined, referer: string = this.URI.href): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method: body ? 'POST' : 'GET',
            headers: {
                'Content-type': 'application/json',
                Referer: referer,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            },
            ...body && { body: JSON.stringify(body) }
        }));
    }
}