// For websites using Mangahub.io API
import type { Tag } from '../../Tags';
import { RandomHex } from '../../Random';
import { RateLimit } from '../../taskpool/RateLimit';
import { FetchCSS, FetchGraphQL, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Delay } from '../../BackgroundTimers';

type GQLMangas = {
    search: {
        rows: {
            slug: string;
            title: string;
        }[];
    };
};

type GQLChapters = {
    manga: {
        chapters: {
            number: number;
            title: string;
        }[];
    };
};

type GQLPages = {
    chapter: {
        pages: string;
    };
};

type JSONPages = {
    i: string[];
    p: string;
};

@Common.ImageAjax()
export class MangaHubBase extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.mghcdn.com/graphql';
    private readonly cdnURL = 'https://imgx.mghcdn.com';
    private token = '';

    public constructor (identifier: string, title: string, url: string, private readonly scope: string, ...tags: Tag[]) {
        super(identifier, title, url, ...tags);
    }

    public override async Initialize(): Promise<void> {
        this.imageTaskPool.RateLimit = new RateLimit(8);
        await this.RenewApiKey();
    }

    private async RenewApiKey(): Promise<void> {
        this.token = RandomHex(32);
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mhub_access', '${this.token}');`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'div#mangadetail div.container-fluid div.row h1')).at(0).firstChild.textContent.trim();
        return new Manga(this, provider, new URL(url).pathname.split('/').at(-1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { search: { rows } } = await this.FetchGQL<GQLMangas>(`
            query ($scope: MangaSource) {
            search(x: $scope, q: "", genre: "all", mod: ALPHABET, limit: 99999) { rows { id, slug, title } }
        }`, { scope: this.scope });
        return rows.map(manga => new Manga(this, provider, manga.slug, new DOMParser().parseFromString(manga.title, 'text/html').body.innerText.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { chapters } } = await this.FetchGQL<GQLChapters>(`
            query ($scope: MangaSource, $slug: String) {
                manga(x: $scope, slug: $slug) { chapters { number, title } }
            }
        `, { scope: this.scope, slug: manga.Identifier });
        return chapters.map(chapter => {
            let title = `Ch.${chapter.number}`;
            title += chapter.title ? ` - ${chapter.title}` : '';
            return new Chapter(this, manga, chapter.number.toString(), title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { pages } } = await this.FetchGQL<GQLPages>(`
            query ($scope: MangaSource, $manga: String!, $chapter: Float!) {
                chapter(x: $scope, slug: $manga, number: $chapter) { pages }
            }
        `, {
            scope: this.scope,
            manga: chapter.Parent.Identifier,
            chapter: parseFloat(chapter.Identifier),
        });
        const { i: pageNumbers, p: pagePath }: JSONPages = JSON.parse(pages);
        return pageNumbers.map(pageNumber => new Page(this, chapter, new URL(`${pagePath}${pageNumber}`, this.cdnURL)));
    }

    private async FetchGQL<T extends JSONElement>(query: string, variables: JSONObject, remainingRetryAttempts = 3): Promise<T> {
        const request = new Request(new URL(this.apiURL), {
            headers: {
                'Origin': this.URI.origin,
                'Referer': this.URI.href,
                'X-MHub-Access': this.token,
            }
        });

        try {
            return await FetchGraphQL(request, undefined, query, variables);
        } catch (error) {
            const message = error.params?.join('');
            if (remainingRetryAttempts <= 0) throw error;
            if (/rate\s*limit/i.test(message)) await Delay(2500);
            if (/api\s*key\s*(invalid)?/i.test(message)) await this.RenewApiKey();
            return this.FetchGQL(query, variables, remainingRetryAttempts - 1);
        }
    }
}