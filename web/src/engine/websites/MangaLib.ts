import { Tags } from '../Tags';
import icon from './MangaLib.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type ImageServers = {
    imageServers: ImageServer[]
}

type ImageServer = {
    id: string,
    url: string,
    site_ids: number[]
}

type APIResult<T> = {
    data: T,
    meta: {
        has_next_page: boolean,
    }
}

type APIManga = {
    id: number,
    name: string,
    rus_name: string | null,
    slug_url: string
}

type APIChapter = {
    volume: string,
    number: string,
    name: string,
    branches_count: number,
    branches: {
        id: number,
        branch_id: number | null,
        teams: {
            name: string
        }[]
    }[]
}

type APIPages = {
    pages: {
        url: string
    }[]
}

type AuthData = {
    token: APIToken
}

type APIToken = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    timestamp: number
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.cdnlibs.org/api/';
    private readonly siteId = 1;
    private imageServerURL: string = undefined;
    private token: APIToken = undefined;

    public constructor() {
        super('mangalib', 'MangaLib', 'https://mangalib.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    private async GetOrRenewToken(): Promise<void> {
        if (!this.token) {
            const result = await FetchWindowScript<string>(new Request(this.URI), 'localStorage.getItem("auth");', 750);
            this.token = result ? (JSON.parse(result) as AuthData).token : this.token;
        }

        if (this.IsTokenExpired()) {
            const request = this.CreateRequest('./auth/oauth/token', {
                grant_type: 'refresh_token',
                client_id: '1',
                refresh_token: this.token.refresh_token,
                scope: ''
            });
            try {
                this.token = await FetchJSON<APIToken>(request);
            } catch {
                this.token = undefined;
            }
        }
    }

    private IsTokenExpired(): boolean {
        if (!this.token) return false;
        return this.token.timestamp + this.token.expires_in < Date.now();
    }

    public override async Initialize(): Promise<void> {
        const { data: { imageServers } } = await FetchJSON<APIResult<ImageServers>>(new Request(new URL('./constants?fields[]=imageServers', this.apiUrl)));
        this.imageServerURL = imageServers.find(server => server.id === 'main' && server.site_ids.includes(this.siteId)).url;
        await this.GetOrRenewToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ru/manga/[^/]`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        await this.GetOrRenewToken();
        const mangaSlug = new URL(url).pathname.split('/').at(-1);
        const { data: { slug_url, rus_name, name } } = await FetchJSON<APIResult<APIManga>>(this.CreateRequest(`./manga/${mangaSlug}`));
        return new Manga(this, provider, slug_url, rus_name || name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        await this.GetOrRenewToken();
        const mangaList: Manga[] = [];
        for (let page = 1; true; page++) {
            await Delay(500);
            const { data, meta: { has_next_page } } = await FetchJSON<APIResult<APIManga[]>>(this.CreateRequest(`./manga?page=${page}&site_id[]=${this.siteId}`));
            mangaList.push(...data.map(manga => new Manga(this, provider, manga.slug_url, manga.rus_name || manga.name)));
            if (!has_next_page) break;
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await this.GetOrRenewToken();
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(this.CreateRequest(`./manga/${manga.Identifier}/chapters`));
        return data.reduce((accumulator: Chapter[], chapter) => {
            let baseTitle = `Том ${chapter.volume} Глава ${chapter.number}`;
            baseTitle += chapter.name ? ` - ${chapter.name}` : '';
            const chapters = chapter.branches.map(branch => {
                const teamName = chapter.branches_count > 1 ? `[${branch.teams.at(0).name}]` : '';
                const chapterURL = new URL(`./manga/${manga.Identifier}/chapter?number=${chapter.number}&volume=${chapter.volume}`, this.apiUrl);
                if (branch.branch_id) chapterURL.searchParams.set('branch_id', branch.branch_id.toString());
                return new Chapter(this, manga, chapterURL.pathname + chapterURL.search, [baseTitle, teamName].join(' ').trim());
            });
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(chapter.Identifier));
        return pages.map(page => new Page(this, chapter, new URL(this.imageServerURL + page.url)));
    }

    private CreateRequest(endpoint: string, body: JSONElement = undefined): Request {
        return new Request(new URL(endpoint, this.apiUrl), {
            credentials: body ? 'include' : undefined,
            method: body ? 'POST' : 'GET',
            body: body ? JSON.stringify(body): undefined,
            headers: {
                Authorization: this.token ? `Bearer ${this.token.access_token}` : undefined,
                'Content-type': 'application/json',
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'Site-Id': this.siteId.toString()
            }
        });
    }

}