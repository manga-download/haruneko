import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON } from '../../platform/FetchProvider';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../../BufferEncoder';
import DeScramble from '../../transformers/ImageDescrambler';
import type { Priority } from '../../taskpool/DeferredTask';

export type APIResult<T> = {
    error?: {
        code: string
    },
    data: T,
}

export type APIManga = {
    id: number,
    alias: string,
    title: string,
    episodes: APIChapter[],
}

type APIChapter = {
    id: string,
    alias: string,
    title: string,
    subTitle: string,
}

type APIPages = APIResult<{
    isScramble: boolean,
    images: ImageInfo,
}>;

type ImageInfo = {
    imagePath: string,
    line: string,
    point: string,
    defaultHeight: number,
}[];

type DecrypionKey = APIResult<string>;

type APIUser = {
    user?: {
        accessToken: APISession,
    },
};

type APISession = {
    token: string,
    expiredAt: number,
};

type ScrambleParams = {
    scrambleIndex: number[],
    defaultHeight: number,
}

export class DelitoonBase extends DecoratableMangaScraper {

    private readonly platform: string = 'WEB';
    private activeUserSession: APISession = undefined;
    private readonly apiUrl = new URL('/api/balcony-api-v2/', this.URI);
    protected balconyID: string = 'DELITOON_COM';
    protected pagesEndpoint = './contents/viewer';

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).pathname.split('/').at(-1);
        const endpoint = new URL(`contents/${mangaid}`, this.apiUrl);
        endpoint.searchParams.set('isNotLoginAdult', 'true');
        const { data } = await this.FetchBalconyJSON<APIResult<APIManga>>(endpoint, false);
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

            return this.FetchBalconyJSON<APIResult<APIManga[]>>(url);
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.data.map(element => new Manga(this, provider, element.alias, element.title.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`contents/${manga.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { data } = await this.FetchBalconyJSON<APIResult<APIManga>>(url);
        return data.episodes.map(element => {
            let title = element.title.trim();
            title += element.subTitle ? ' : ' + element.subTitle.trim() : '';
            return new Chapter(this, manga, element.alias, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParams>[]> {
        const url = new URL(`${this.pagesEndpoint}/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { error, data: { images, isScramble } } = await this.FetchBalconyJSON<APIPages>(url);
        switch (error?.code) {
            case 'NOT_LOGIN_USER':
            case 'UNAUTHORIZED_CONTENTS':
                throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return isScramble ? this.FetchScarambledPages(chapter, images) : images.map(image => new Page(this, chapter, new URL(image.imagePath)));
    }

    private async FetchScarambledPages(chapter: Chapter, images: ImageInfo): Promise<Page<ScrambleParams>[]> {
        const endpoint = new URL(`contents/images/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        const { data } = await this.FetchBalconyJSON<DecrypionKey>(endpoint, { line: images[0].line });
        const keyData = GetBytesFromUTF8(data);
        const algorithm = { name: 'AES-CBC', iv: keyData.slice(0, 16), length: 256 };
        const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, [ 'decrypt' ]);
        const promises = images.map(async image => {
            const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromBase64(image.point));
            const scrambleIndex = JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as number[];
            return new Page<ScrambleParams>(this, chapter, new URL(image.imagePath), { scrambleIndex, defaultHeight: image.defaultHeight });
        });
        return Promise.all(promises);
    }

    private CreateBalconyRequest(url: URL, body: JSONElement = undefined): Request {
        return new Request(url, {
            method: body ? 'POST' : 'GET',
            headers: {
                'Referer': this.URI.origin,
                'X-Balcony-Id': this.balconyID,
                'X-Platform': this.platform,
                'Content-Type': body ? 'application/json' : undefined,
                'Authorization': this.activeUserSession ? ' Bearer ' + this.activeUserSession.token : undefined,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    protected async FetchBalconyJSON<T extends JSONElement>(url: URL, body: JSONElement = undefined): Promise<T> {
        if (!this.activeUserSession || this.activeUserSession.expiredAt < Date.now() - 60_000) {
            const request = this.CreateBalconyRequest(new URL('/api/auth/session', this.URI));
            const { user } = await FetchJSON<APIUser>(request);
            this.activeUserSession = user?.accessToken;
        }
        return FetchJSON<T>(this.CreateBalconyRequest(url, body));
    }

    public override async FetchImage(page: Page<ScrambleParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const scrambledata = page.Parameters;
        return !scrambledata?.scrambleIndex ? blob : DeScramble(blob, async (image, ctx) => {
            scrambledata.scrambleIndex.forEach((scramblevalue, index) => {
                const pieceWidth = image.width / 4;
                const pieceHeight = scrambledata.defaultHeight / 4;
                const sourceX = index % 4 * pieceWidth;
                const sourceY = Math.floor(index / 4) * pieceHeight;
                const destinationX = scramblevalue % 4 * pieceWidth;
                const destinationY = Math.floor(scramblevalue / 4) * pieceHeight;
                ctx.drawImage(image, sourceX, sourceY, pieceWidth, pieceHeight, destinationX, destinationY, pieceWidth, pieceHeight);
            });
        });
    }
}