import { Tags } from '../Tags';
import icon from './Delitoon.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

export type APIResult<T> = {
    result: string,
    data: T
}

export type APIManga = {
    id: number,
    alias: string,
    title: string
    episodes: APIChapter[]
}

type APIChapter = {
    id: string,
    alias: string,
    title: string,
    subTitle: string
}

export type APIPages = {
    images: {
        imagePath: string
    }[]
}

//Result from /auth/session : to get token
type APIUser = {
    user?: APIToken
}

//Result from /auth/refresh : to refresh token
type APIRefreshToken = {
    result: APIToken
}

//Auth token entity
type APIToken = {
    accessToken: {
        token: string,
        expiredAt: number
    },
    refreshToken: {
        token: string
    }
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly BalconyID: string = undefined;
    private readonly Timezone: string = 'Europe/Paris';
    private readonly Platform: string = 'WEB';
    private Token: APIToken = undefined;
    private readonly apiUrl = new URL('/api/balcony-api-v2/', this.URI);

    public constructor(id = 'delitoon', label = 'Delitoon', url = 'https://www.delitoon.com', balconyID = 'DELITOON_COM', tags = [Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official]) {
        super(id, label, url, ...tags);
        this.BalconyID = balconyID;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).href.match(/\/detail\/([^/]+)/)[1];
        const endpointUrl = new URL(`contents/${mangaid}`, this.apiUrl);
        endpointUrl.searchParams.set('isNotLoginAdult', 'true');
        const { data } = await FetchJSON<APIResult<APIManga>>(this.CreateRequest(endpointUrl));
        return new Manga(this, provider, mangaid, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('contents/search', this.apiUrl);
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            url.search = new URLSearchParams({
                searchText: character,
                isCheckDevice: 'true',
                isIncludeAdult: 'true',
                contentsThumbnailType: 'MAIN'
            }).toString();

            return FetchJSON<APIResult<APIManga[]>>(this.CreateRequest(url));
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.data.map(element => new Manga(this, provider, element.alias, element.title.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await this.UpdateToken();
        const url = new URL(`contents/${manga.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { data } = await FetchJSON<APIResult<APIManga>>(this.CreateRequest(url));
        return data.episodes.map(element => {
            let title = element.title.trim();
            title += element.subTitle ? ' : ' + element.subTitle.trim() : '';
            return new Chapter(this, manga, element.alias, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await this.UpdateToken();
        const url = new URL(`contents/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const apiresult = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(url));
        if (apiresult.result === 'ERROR') {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return apiresult.data.images.map(element => new Page(this, chapter, new URL(element.imagePath)));

    }

    protected CreateRequest(url: URL): Request {
        const headers: HeadersInit = {
            Referer: this.URI.origin,
            'x-balcony-id': this.BalconyID,
            'x-balcony-timeZone': this.Timezone,
            'X-platform': this.Platform,
        };
        if (this.Token) headers['authorization'] = ' Bearer ' + this.Token.accessToken.token;
        return new Request(url, {
            method: 'GET',
            headers: headers
        });
    }

    private CreatePostRequest(url: URL, body: string, contentType: string = 'application/json'): Request {
        const headers: HeadersInit = {
            Referer: this.URI.origin,
            'x-balcony-id': this.BalconyID,
            'x-balcony-timeZone': this.Timezone,
            'X-platform': this.Platform,
            'Content-type': contentType
        };
        if (this.Token) headers['authorization'] = ' Bearer ' + this.Token.accessToken.token;
        return new Request(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });
    }

    protected async UpdateToken() {
        //if token is undefined => try to fetch one
        if (!this.Token) {
            const url = new URL('/api/auth/session', this.URI);
            const { user } = await FetchJSON<APIUser>(this.CreateRequest(url));
            this.Token = user;
            return;
        }

        //if token is defined, check for expiration  and refresh if needed
        if (Date.now() > this.Token.accessToken.expiredAt) { //24h expiration
            const url = new URL('/api/balcony/auth/refresh', this.URI);
            const body = JSON.stringify({
                accessToken: this.Token.accessToken.token,
                refreshToken: this.Token.refreshToken.token
            });
            const { result } = await FetchJSON<APIRefreshToken>(this.CreatePostRequest(url, body));
            this.Token = result;
        }

    }
}