import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON } from '../../platform/FetchProvider';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../../BufferEncoder';
import DeScramble from '../../transformers/ImageDescrambler';
import type { Priority } from '../../taskpool/DeferredTask';

export type APIResult<T> = {
    result: string,
    error?: {
        code: string
    }
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

type APIPages = {
    isScramble: boolean,
    images: {
        imagePath: string,
        line: string,
        point: string,
        defaultHeight: number,
    }[]
}

type APIUser = {
    user?: {
        accessToken: APIToken,
    },
};

type APIToken = {
    token: string,
    expiredAt: number,
};

type ScrambleParams = {
    scrambleIndex: number[],
    defaultHeight: number,
}

export class DelitoonBase extends DecoratableMangaScraper {
    private readonly Platform: string = 'WEB';
    private authorization: APIToken = undefined;
    protected readonly apiUrl = new URL('/api/balcony-api-v2/', this.URI);
    protected BalconyID: string = 'DELITOON_COM';
    protected pagesEndpoint = './contents/viewer';

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).pathname.split('/').at(-1);
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

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParams>[]> {
        await this.UpdateToken();
        const url = new URL(`${this.pagesEndpoint}/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { error, data: { images, isScramble } } = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(url));
        switch (error?.code) {
            case 'NOT_LOGIN_USER':
            case 'UNAUTHORIZED_CONTENTS':
                throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        if (isScramble) {
            const endpoint = new URL(`contents/images/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
            const body = JSON.stringify({ line: images[0].line });
            const { data } = await FetchJSON<APIResult<string>>(this.CreateRequest(endpoint, true, body));
            const promises = images.map(async image => {
                const scrambleIndex = await this.Decrypt(image.point, data);
                return new Page<ScrambleParams>(this, chapter, new URL(image.imagePath), { scrambleIndex, defaultHeight: image.defaultHeight });
            });
            return Promise.all(promises);
        } else return images.map(element => new Page(this, chapter, new URL(element.imagePath)));
    }

    private async Decrypt(encrypted: string, scramblekey: string): Promise<number[]> {
        const cipher = { name: 'AES-CBC', iv: GetBytesFromUTF8(scramblekey.slice(0, 16)) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(scramblekey), { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(cipher, key, GetBytesFromBase64(encrypted));
        return JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as number[];
    }

    protected CreateRequest(url: URL, includeAuthorization = true, body: string = undefined): Request {
        const request = new Request(url, {
            method: body ? 'POST' : 'GET',
            headers: {
                'Referer': this.URI.origin,
                'X-Balcony-Id': this.BalconyID,
                'X-Platform': this.Platform,
                'Content-type': body ? 'application/json' : undefined
            },
            body: body
        });
        if (this.authorization && includeAuthorization) {
            request.headers.set('authorization', ' Bearer ' + this.authorization.token);
        }
        return request;
    }

    protected async UpdateToken() {
        if (!this.authorization || this.authorization.expiredAt < Date.now()) {
            const url = new URL('/api/auth/session', this.URI);
            const { user } = await FetchJSON<APIUser>(this.CreateRequest(url, false));
            this.authorization = user?.accessToken;
        }
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