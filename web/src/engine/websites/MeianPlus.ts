import { Tags } from '../Tags';
import icon from './MeianPlus.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APISerie = {
    licence: {
        id_licence: number,
        titre_licence: string,
        articles: {
            ref: number,
            titre: string,
            ebook_statut: boolean
        }[]
    }
}

type APISeries = {
    licences: APISerie['licence'][];
}

type APIEbook = {
    success: boolean,
    message: string,
    ebook: {
        max_page: number
    }
}

type APIImages = {
    images: {
        ref: number,
        key: string,
        w: number,
        h: number,
        param: string
    }[]
}

type PageInfo = {
    descrambleBlock: {
        width: number,
        height: number,
    }
}

/**
 * A basic oAuth token manager with MeianPlus specific business logic
 */
class TokenProvider {

    #token: string = null;

    constructor(private readonly clientURI: URL) { }

    /**
     * Extract the token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateToken() {
        try {
            this.#token = JSON.parse(decodeURIComponent(await FetchWindowScript<string>(new Request(this.clientURI), `(async () => (await cookieStore.get('token_meian_plusc'))?.value ?? null)();`)));
        } catch (error) {
            console.warn('UpdateToken()', error);
            this.#token = null;
        }
    }

    /**
     * Determine the _Bearer_ extracted from the current token and add it as authorization header to the given {@link init} headers (replacing any existing authorization header).
     * In case the _Bearer_ could not be extracted from the current token the authorization header will not be added/replaced.
     */
    public async ApplyAuthorizationHeader(init: HeadersInit): Promise<HeadersInit> {
        const headers = new Headers(init);
        if (this.#token) {
            headers.set('Authorization', 'Bearer ' + this.#token);
        }
        return headers;
    }
}

export default class extends DecoratableMangaScraper {
    private readonly tokenProvider: TokenProvider;
    private readonly apiUrl = 'https://api.meian-plus.fr/v1/';
    private readonly imageCDN = 'https://ebook.meian-plus.fr/';
    private readonly scramblingMatrix = new Array(100).fill(null).map((_, index) => [(index / 10 >> 0) + 1, (index % 10 >> 0) + 1]);

    public constructor() {
        super('meianplus', 'Meian Plus', 'https://www.meian-plus.fr', Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
        this.tokenProvider = new TokenProvider(this.URI);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        await this.tokenProvider.UpdateToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/catalogue/licence/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { licence: { id_licence, titre_licence } } = await this.FetchAPI<APISerie>(this.apiUrl, './licence/', {
            id_licence: url.split('/').at(-1)
        });
        return new Manga(this, provider, id_licence.toString(), titre_licence);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { licences } = await this.FetchAPI<APISeries>(this.apiUrl, './licences/', {
            ebook: '1',
            limit: '96',
            index: '' + page,
        });
        return licences.map(item => new Manga(this, provider, item.id_licence.toString(), item.titre_licence));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { licence: { articles } } = await this.FetchAPI<APISerie>(this.apiUrl, './licence/', { id_licence: manga.Identifier });
        return articles.filter(item => item.ebook_statut)
            .map(item => {
                const title = item.titre.replace(manga.Title, '').replace(/^\s*-\s*/, '').trim();
                return new Chapter(this, manga, item.ref.toString(), title);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageInfo>[]> {
        const { success, ebook } = await this.FetchAPI<APIEbook>(this.apiUrl, './ebook/', { ref: chapter.Identifier });
        if (!success) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        const { images } = await this.FetchAPI<APIImages>(this.imageCDN, './v1/images/', {
            p: '1',
            q: '1',
            w: '1920',
            h: '1080',
            webp: 'false',
            devicePixelRatio: (3/2).toFixed(1),
            nb_pages: '' + ebook.max_page,
            ref: chapter.Identifier,
        });

        return images.map(item => new Page<PageInfo>(this, chapter, new URL('./hm-img?' + new URLSearchParams({
            prio: 'h',
            k: item.key,
            p: item.param,
        }), this.imageCDN), {
            descrambleBlock: {
                width: item.w,
                height: item.h,
            }
        }));
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (image, ctx) => {
            const block = page.Parameters.descrambleBlock;
            const decryptedDrmData = window.atob(page.Link.searchParams.get('k')).split('|');
            for (let i = 0; i < decryptedDrmData.length; i++) {
                const pieceMatrix = decryptedDrmData[i].split(';');
                const sourceY = (this.scramblingMatrix[i][0] - 1) * block.height;
                const sourceX = (this.scramblingMatrix[i][1] - 1) * block.width;
                const destY = (parseInt(pieceMatrix[0]) - 1) * block.height;
                const destX = (parseInt(pieceMatrix[1]) - 1) * block.width;
                ctx.drawImage(image, sourceX, sourceY, block.width, block.height, destX, destY, block.width, block.height);
            }
        });
    }

    private async FetchAPI<T extends JSONElement>(base: string, endpoint: string, search: Record<string, string>): Promise<T> {
        const uri = new URL(endpoint + '?' + new URLSearchParams(search), base);
        const request = new Request(uri, {
            headers: await this.tokenProvider.ApplyAuthorizationHeader({ Referer: this.URI.href })
        });
        const response = await Fetch(request);
        const text = await response.text();
        return JSON.parse(text.split('\n').at(-1));
    }
}