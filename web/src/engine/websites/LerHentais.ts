import { Tags } from '../Tags';
import icon from './LerHentais.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    result: {
        data: {
            json: T;
        };
    };
}[];

type APIMangas = {
    hits: APIManga[];
};

type APIManga = {
    id: string;
    slug: string;
    title: string;
};

type APIChapter = {
    number: number;
};

type APIPage = {
    webpUrl: string;
};

type APIHeader = {
    key: string;
    value: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL: string;
    private secretHeader: APIHeader;

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('lerhentais', 'LerHentais', 'https://lerhentais.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
        }
        this.apiURL = `${this.URI.origin}/api/trpc/`;
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.secretHeader = await FetchWindowScript(new Request(this.URI), `
            new Promise( resolve => {
                window.fetch = new Proxy(window.fetch, {
                    apply(target, thisArg, args) {
                        try {
                            const request = new Request(...args);
                            for (const [key,value]of request.headers) {
                                if(key.toLowerCase().startsWith('x-')) {
                                    resolve( { key, value } );
                                }
                            }
                        } catch {}
                        return Reflect.apply(target, thisArg, args);
                    }
                });

                const [element] = [...document.querySelectorAll('main button:has(svg):not([disabled])')]
                element.click();
            });
        `, 1500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, slug, title } = await this.FetchTRPC<APIManga>('./series.bySlugWithGenres?batch=1', {
            slug: url.split('/').at(-1)
        });
        return new Manga(this, provider, `${id}/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 100) {
                const { hits } = await this.FetchTRPC<APIMangas>('./search.query?batch=1', {
                    q: '',
                    limit: 100,
                    offset,
                    maxRating: 'pornographic'
                });
                const mangas = hits.map(({ id, title, slug }) => new Manga(this, provider, `${id}/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchTRPC<APIChapter[]>('./series.chapters?batch=1', {
            seriesId: parseInt(manga.Identifier.split('/').at(0)),
            chapterId: null,
            sort: 'best',
            page: 1,
            limit: 9999
        });
        return chapters.map(({ number }) => new Chapter(this, manga, `${number}`, `${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.FetchTRPC<APIPage[]>('./reader.chapterPages?batch=1', {
            seriesSlug: chapter.Parent.Identifier.split('/').at(1),
            chapterNumber: parseInt(chapter.Identifier)
        });
        return pages.map(({ webpUrl }) => new Page(this, chapter, new URL(webpUrl), { Referer: this.URI.href }));
    }

    private async FetchTRPC<T extends JSONElement>(endpoint: string, payload: JSONElement): Promise<T> {
        const uri = new URL(endpoint, this.apiURL);
        uri.searchParams.set('input', JSON.stringify({
            0: {
                json: payload
            }
        }));
        const [{ result: { data: { json } } }] = await FetchJSON<APIResult<T>>(new Request(new URL(uri), {
            headers: {
                [this.secretHeader.key]: this.secretHeader.value,
                Referer: this.URI.href
            }
        }));
        return json;
    };
}