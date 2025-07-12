import { Tags } from '../Tags';
import icon from './Mangadon.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { GetHexFromBytes, GetBytesFromUTF8 } from '../BufferEncoder';

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
        return new RegExpSafe(`^${this.URI.origin}/catalogs/show\\?tb=\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = new URL(url).searchParams.get('tb');
        const { data } = await FetchJSON<APIResult>(new Request(new URL(`/api/v1/comics/${mangaid}`, this.URI)));
        const title = (data as APIItem).attributes.name.trim();
        return new Manga(this, provider, mangaid, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult>(new Request(new URL(`/api/v1/comics`, this.URI)));
        return (data as APIItem[]).map(manga => new Manga(this, provider, manga.id, manga.attributes.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { included } = await FetchJSON<APIResult>(new Request(new URL(`/api/v1/comics/${manga.Identifier}?includes[]=episodes`, this.URI)));
        return included.map(chapter => new Chapter(this, manga, chapter.id, chapter.attributes.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const authToken = await FetchWindowScript<string>(new Request(this.URI), auhTokenScript, 500);
        const request = new Request(new URL(`/api/v1/episodes/${chapter.Identifier}?params[cookie_signer]=true&params[pages]=true`, this.URI));
        if (authToken) request.headers.set('Authorization', authToken);
        const { data } = await FetchJSON<APIResult>(request);
        const cookies = (data as APIItem).attributes.cookie_signer;

        if (!cookies['CloudFront-Key-Pair-Id']) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return (data as APIItem).attributes.pages.map(page => new Page<CookieSigner>(this, chapter, new URL(page.path, this.imgCDN), { ...cookies }));
    }

    public override async FetchImage(page: Page<CookieSigner>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {

            const cookiesData = page.Parameters;
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
            const columnCount = Math.floor(image.width / this.partsWidth);
            const rowCount = Math.floor(image.height / this.partsHeight);

            async function sha256(text: string): Promise<string> {
                const buffer = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(text));
                return GetHexFromBytes(new Uint8Array(buffer));
            }

            (await Promise.all([ ...new Array(columnCount * rowCount) ].map(async (_, index) => ({
                hash: await sha256(`${index}_${this.decodeKey}`),
                index,
            }))))
                .sort((self, other) => self.hash.localeCompare(other.hash))
                .forEach((sourceBlock, targetBlockIndex) => {
                    const sourceX = this.partsWidth * (sourceBlock.index % columnCount);
                    const sourceY = this.partsHeight * Math.floor(sourceBlock.index / columnCount);
                    const destX = this.partsWidth * (targetBlockIndex % columnCount);
                    const destY = this.partsHeight * Math.floor(targetBlockIndex / columnCount);
                    ctx.drawImage(image, sourceX, sourceY, this.partsWidth, this.partsHeight, destX, destY, this.partsWidth, this.partsHeight);
                });
        });
    }
}