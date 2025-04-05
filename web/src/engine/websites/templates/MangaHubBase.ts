// For websites using Mangahub.io API

import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { FetchCSS, FetchGraphQL, FetchWindowScript } from '../../platform/FetchProvider';
import * as Common from '../decorators/Common';
import { RateLimit } from '../../taskpool/RateLimit';

type APIMangas = {
    search: {
        rows: {
            slug: string,
            title: string
        }[]
    }
}

type APIChapters = {
    manga: {
        chapters: {
            number: number,
            title: string
        }[]
    }
}

type APIPages = {
    chapter: {
        pages: string
    }
}

type JSONPages = {
    i: string[],
    p: string
}

function SetTokenCookie(token: string) {
    return `
        new Promise(async (resolve, reject) => {
            try {
                await window.cookieStore.set('mhub_access', '${token}');
                resolve () ;
            } catch (error) {
                reject(error);
            }
        });
`;

}

function RandomString(length: number) {
    return Array.from({ length }, () => Math.random().toString(16).at(-1)).join('');
}

@Common.ImageAjax()
export class MangaHubBase extends DecoratableMangaScraper {
    protected path = 'm01';
    private readonly apiURL = 'https://api.mghcdn.com/graphql';
    private readonly cdnURL = 'https://imgx.mghcdn.com';
    private apiKey = '';

    public override async Initialize(): Promise<void> {
        this.imageTaskPool.RateLimit = new RateLimit(4, 0.5); //i have seen errors 522, no sore tare is accurate
        await this.RenewApiKey();
        if (!this.apiKey) {
            throw new Error(`${this.Title}: Can't initialize the API key! Try selecting another manga from this connector!`);
        }
    }

    private async RenewApiKey() {
        this.apiKey = RandomString(32);
        await FetchWindowScript(new Request(this.URI), SetTokenCookie(this.apiKey));
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'div#mangadetail div.container-fluid div.row h1')).at(0).firstChild.textContent.trim();
        return new Manga(this, provider, new URL(url).pathname.split('/').at(-1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const query = `{
            search(x: ${this.path}, q: "", genre: "all", mod: ALPHABET, limit: 99999) {
                rows {
                    id, slug, title
                }
            }
        }`;
        const { search: { rows } } = await this.FetchGraphQL<APIMangas>( query );
        return rows.map(manga => new Manga(this, provider, manga.slug, new DOMParser().parseFromString(manga.title, 'text/html').body.innerHTML.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `{
            manga(x: ${this.path}, slug: "${manga.Identifier}") {
                chapters {
                    id, number, title, slug
                }
            }
        }`;
        const { manga: { chapters } } = await this.FetchGraphQL<APIChapters>(query);
        return chapters.map(chapter => {
            let title = `Ch.${chapter.number}`;
            title += chapter.title ? ` - ${chapter.title}` : '';
            return new Chapter(this, manga, chapter.number.toString(), title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const query = `{
            chapter(x: ${this.path}, slug: "${chapter.Parent.Identifier}", number: ${chapter.Identifier}) {
                pages
            }
        }`;
        const { chapter: { pages } } = await this.FetchGraphQL<APIPages>( query );
        const pagesJSON = JSON.parse(pages) as JSONPages;
        return pagesJSON.i.map(page => new Page(this, chapter, new URL(`${pagesJSON.p}${page}`, this.cdnURL)));
    }

    private async FetchGraphQL<T extends JSONElement>(query: string): Promise<T> {
        const request = new Request(new URL(this.apiURL), {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-Mhub-Access': this.apiKey
            }
        });

        for (let i = 0; i < 3; i++) {
            try {
                return await FetchGraphQL(request, undefined, query, undefined);
            } catch (error) {
                const message = error.params?.join('');
                if (/(api)?\s*rate\s*limit\s*(excessed)?|api\s*key\s*(invalid)?/i.test(message)) {
                    console.warn(`${this.Title}: Renewing api Key`);
                    await this.RenewApiKey();
                    request.headers.set('X-Mhub-Access', this.apiKey);
                } else {
                    throw new Error(message);
                }
            }
        }
    }
}
