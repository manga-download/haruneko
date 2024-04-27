import { Tags } from '../Tags';
import icon from './Mangadon.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIResult = {
    data: APIItem[] | APIItem,
    included: APIItem[],
}

type APIItem = {
    id: string,
    attributes: {
        name: string,
        cookie_signer: CookieSigner
        pages: {
            path: string
        }[]

    }
}

type CookieSigner = {
    'CloudFront-Policy': string,
    'CloudFront-Signature': string,
    'CloudFront-Key-Pair-Id': string
}

const auhTokenScript = `
    new Promise(resolve => {
        window.cookieStore.get('auth._token.local')
            .then(cookie => !cookie ? resolve(cookie) : resolve(decodeURIComponent(cookie.value))) ;
    });
`;

export default class extends DecoratableMangaScraper {
    private readonly imgCDN = 'https://contents.mangadon.me';
    private readonly partsWidth = 240;
    private readonly partsHeight = 240;
    private readonly decodeKey = 'wwwave-bago';

    public constructor() {
        super('mangadon', 'Mangadon', 'https://mangadon.me', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/catalogs/show\\?tb=\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).searchParams.get('tb');
        const request = new Request(new URL(`/api/v1/comics/${mangaid}`, this.URI));
        const { data } = await FetchJSON<APIResult>(request);
        const title = (data as APIItem).attributes.name.trim();
        return new Manga(this, provider, mangaid, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/api/v1/comics`, this.URI));
        const { data } = await FetchJSON<APIResult>(request);
        return (data as APIItem[]).map(manga => new Manga(this, provider, manga.id, manga.attributes.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/v1/comics/${manga.Identifier}?includes%5B%5D=episodes`, this.URI));
        const { included } = await FetchJSON<APIResult>(request);
        return included.map(chapter => new Chapter(this, manga, chapter.id, chapter.attributes.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const authToken = await FetchWindowScript<string>(new Request(this.URI), auhTokenScript, 500);
        const request = new Request(new URL(`/api/v1/episodes/${chapter.Identifier}?params%5Bcookie_signer%5D=true&params%5Bpages%5D=true`, this.URI));
        if (authToken) request.headers.set('Authorization', authToken);
        const { data } = await FetchJSON<APIResult>(request);
        const cookies = (data as APIItem).attributes.cookie_signer;

        if (!cookies['CloudFront-Key-Pair-Id']) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return (data as APIItem).attributes.pages.map(page => new Page(this, chapter, new URL(page.path, this.imgCDN), { ...cookies }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {

            const cookiesData = page.Parameters as CookieSigner;
            const cookies: string[] = [];
            Object.keys(cookiesData).forEach(name => {
                const value = cookiesData[name];
                cookies.push(`${name}=${value}`);
            });

            const request = new Request(page.Link, {
                signal: signal,
                headers: {
                    Cookie: cookies.join(';'),
                    Referer: page.Link.origin,
                }
            });

            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);

        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const numCols = Math.floor(image.width / this.partsWidth);
            const numLines = Math.floor(image.height / this.partsHeight);
            const numPieces = numCols * numLines;
            const m: string[] = [];

            async function sha256(text: string): Promise<string> {
                return Buffer.from(await crypto.subtle.digest('SHA-256', Buffer.from(text))).toString('hex');
            }

            for (let i = 0; i <= numPieces - 1; i++) {
                m.push(await sha256(''.concat(i.toString(), '_').concat(this.decodeKey)));
            }
            const v = Array.from(m).sort();
            const f: number[] = [];
            m.forEach(function (t, i) {
                f[i] = v.indexOf(t);
            });

            for (let index = 0; index <= numPieces - 1; index++) {
                const value = f[index];
                const r = this.partsWidth * (index % numCols);
                const l = this.partsHeight * Math.floor(index / numCols);
                const d = this.partsWidth * (value % numCols);
                const m = this.partsHeight * Math.floor(value / numCols);
                ctx.drawImage(image, r, l, this.partsWidth, this.partsHeight, d, m, this.partsWidth, this.partsHeight);
            }
        });
    }
}