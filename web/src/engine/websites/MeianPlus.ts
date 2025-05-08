import { Tags } from '../Tags';
import icon from './MeianPlus.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APISeries = {
    licences: APISerieDetails[];
}

type APISerie = {
    licence: APISerieDetails
}

type APISerieDetails = {
    id_licence: number,
    titre_licence: string,
    articles: {
        ref: number,
        titre: string,
        ebook_statut: boolean
    }[]
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

type BlockInfo = {
    w: number,
    h: number
}

const tokenScript = `decodeURIComponent(document.cookie.match(/token_meian_plus=([^;]+)/).at(1)).replaceAll('"', '');`;
const scramblingMatrix: Array<Array<number>> = [];

for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        scramblingMatrix.push([i, j]);
    }
}

export default class extends DecoratableMangaScraper {
    private token: string = undefined;
    private readonly apiUrl = 'https://api.meian-plus.fr/v1/';
    private readonly imageCDN = 'https://ebook.meian-plus.fr/';

    public constructor() {
        super('meianplus', 'Meian Plus', 'https://www.meian-plus.fr', Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    private async UpdateToken() {
        this.token = await FetchWindowScript(new Request(this.URI), tokenScript, 2500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/catalogue/licence/[^/]+/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const idLicence = url.match(/\/licence\/[^/]+\/(\d+)$/).at(1);
        const { licence: { id_licence, titre_licence } } = await this.FetchJSON<APISerie>(this.CreateRequest(`./licence/?id_licence=${idLicence}`));
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
        const { licences } = await this.FetchJSON<APISeries>(this.CreateRequest(`./licences/?q=&index=${page}&limit=96&ebook=1`));
        return licences.map(item => new Manga(this, provider, item.id_licence.toString(), item.titre_licence));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { licence: { articles } } = await this.FetchJSON<APISerie>(this.CreateRequest(`./licence/?id_licence=${manga.Identifier}`));
        return articles.filter(item => item.ebook_statut)
            .map(item => {
                const title = item.titre.replace(manga.Title, '').replace(/^\s*-\s*/, '').trim();
                return new Chapter(this, manga, item.ref.toString(), title);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<BlockInfo>[]> {
        await this.UpdateToken();
        //get pages number
        const { success, ebook } = await this.FetchJSON<APIEbook>(this.CreateRequest(`./ebook/?ref=${chapter.Identifier}`));

        if (!success) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        //get pagesinfo
        const request = this.CreateRequest(`./v1/images/?ref=${chapter.Identifier}&p=1&w=1920&h=1080&q=1&webp=true=&nb_pages=${ebook.max_page}&devicePixelRatio=1.5`, this.imageCDN);
        const { images } = await this.FetchJSON<APIImages>(request);
        return images.map(item => new Page<BlockInfo>(this, chapter, new URL(`${this.imageCDN}/hm-img?p=${item.param}'&prio=h&k=${item.key}`), {
            w: item.w,
            h: item.h
        }));
    }

    public override async FetchImage(page: Page<BlockInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (image, ctx) => {
            const decryptedDrmData = window.atob(page.Link.searchParams.get('k')).split('|');
            for (let i = 0; i < decryptedDrmData.length; i++) {
                const pieceMatrix = decryptedDrmData[i].split(';');
                const sourceY = (scramblingMatrix[i][0] - 1) * page.Parameters.h;
                const sourceX = (scramblingMatrix[i][1] - 1) * page.Parameters.w;
                const destY = (parseInt(pieceMatrix[0]) - 1) * page.Parameters.h;
                const destX = (parseInt(pieceMatrix[1]) - 1) * page.Parameters.w;
                ctx.drawImage(image, sourceX, sourceY, page.Parameters.w, page.Parameters.h, destX, destY, page.Parameters.w, page.Parameters.h);
            }
        });
    }

    private CreateRequest(endpoint: string, baseUrl: string = this.apiUrl): Request {
        return new Request(new URL(endpoint, baseUrl), {
            headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: this.token ? `Bearer ${this.token}` : null,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
    }

    private async FetchJSON<T extends JSONElement>(request: Request): Promise<T> {
        const response = await Fetch(request);
        const text = await response.text();
        return JSON.parse(text.replace(/^\)\]}',/, '')) as T;
    }
}