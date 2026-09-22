import { Fetch, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import DeScramble from '../../transformers/ImageDescrambler';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import type { Priority } from '../../taskpool/DeferredTask';
import { GetBytesFromBase64, GetUTF8FromBytes } from '../../BufferEncoder';

type APISerie = {
    licence: {
        id_licence: number;
        titre_licence: string;
        articles: {
            ref: number;
            titre: string;
            ebook_statut: boolean;
        }[];
    };
};

type APISeries = {
    licences: APISerie['licence'][];
};

type APIImages = {
    images: {
        ref: number;
        key: string;
        w: number;
        h: number;
        param: string;
    }[];
};

type PageInfo = {
    descrambleBlock: {
        width: number;
        height: number;
    };
};

type APIEbook = {
    success: boolean;
    ebook: {
        max_page: number;
    };
};

type WebsiteParameters = {
    apiURL: string;
    imageCDN: string;
    tokenCookieName: string;
    additionalHeaders?: Record<string, string>;
};

export class MeianBase extends DecoratableMangaScraper {

    private apiURL: string;
    private imageCDN: string;
    private tokenCookieName: string;
    private additionalHeaders?: Record<string, string>;

    #token: null | string = null;
    private readonly scramblingMatrix = new Array(100).fill(null).map((_, index) => [(index / 10 >> 0) + 1, (index % 10 >> 0) + 1]);

    public SetParameters(parameters: WebsiteParameters): MeianBase {
        this.apiURL = parameters.apiURL;
        this.imageCDN = parameters.imageCDN;
        this.tokenCookieName = parameters.tokenCookieName;
        this.additionalHeaders = parameters.additionalHeaders;
        return this;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interactio
        this.#token = await FetchWindowScript<null | string>(new Request(this.URI), `cookieStore.get('${this.tokenCookieName}').then(({ value }) => JSON.parse(decodeURIComponent(value)) ?? null).catch(error => null)`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/catalogue/licence/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { licence: { id_licence, titre_licence } } = await this.FetchAPI<APISerie>(`./licence/?id_licence=${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id_licence}`, titre_licence);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { licences } = await this.FetchAPI<APISeries>(`./licences/?limit=96&index=${page}&ebook=1`);
                const mangas = licences.map(({ id_licence: id, titre_licence: title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { licence: { articles } } = await this.FetchAPI<APISerie>(`./licence/?id_licence=${manga.Identifier}`);
        return articles.filter(item => item.ebook_statut)
            .map(({ ref, titre }) => new Chapter(this, manga, `${ref}`, titre.replace(manga.Title, '').replace(/^\s*-\s*/, '').trim())).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageInfo>[]> {
        const { success, ebook: { max_page } } = await this.FetchAPI<APIEbook>(`./ebook/?ref=${chapter.Identifier}`);
        if (!success) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        const { images } = await this.FetchAPI<APIImages>(`./v1/images/?p=1&q=1&w=1920&h=1080&webp=false&nb_pages=${max_page}&ref=${chapter.Identifier}&devicePixelRatio=2`, this.imageCDN);
        return images.map(({ key, param, w, h }) => new Page<PageInfo>(this, chapter, new URL('./hm-img?' + new URLSearchParams({
            prio: 'h', k: key, p: param
        }), this.imageCDN), {
            descrambleBlock: { width: w, height: h, }
        }));
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (image, ctx) => {
            const { height, width } = page.Parameters.descrambleBlock;
            const decryptedDrmData = GetUTF8FromBytes(GetBytesFromBase64(page.Link.searchParams.get('k'))).split('|');
            for (let i = 0; i < decryptedDrmData.length; i++) {
                const pieceMatrix = decryptedDrmData[i].split(';');
                const sourceY = (this.scramblingMatrix[i][0] - 1) * height;
                const sourceX = (this.scramblingMatrix[i][1] - 1) * width;
                const destY = (parseInt(pieceMatrix[0]) - 1) * height;
                const destX = (parseInt(pieceMatrix[1]) - 1) * width;
                ctx.drawImage(image, sourceX, sourceY, width, height, destX, destY, width, height);
            }
        });
    }

    protected async FetchAPI<T extends JSONElement>(endpoint: string, base: string = this.apiURL): Promise<T> {
        const response = await Fetch(new Request(new URL(endpoint, base), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Sec-Fetch-Site':	'same-site',
                ...this.#token && { Authorization: `Bearer ${this.#token}` },
                ...this.additionalHeaders
            }
        }));
        const text = await response.text();
        return <T>JSON.parse(text.split('\n').at(-1));
    }
}