import { Tags } from '../Tags';
import icon from './CopyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';

type APIResponse<T> = {
    code: number,
    message: string,
    results: T
}

type APISingleComic = {
    comic: APIComic
}

type APIComic = {
    path_word: string,
    name: string
}

type APIResultList<T> = {
    list: T[]
}

type APIChapters = {
    groups: {
        default: {
            chapters: {
                name: string,
                id: string
            }[]
        }
    }
}

type APIPage = {
    url :string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly keyData = GetBytesFromUTF8('xxxmanga.woo.key');

    public constructor() {
        super('copymanga', 'CopyManga', 'https://www.copy20.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);

        //this.Settings.url = new Text('urloverride', W.Plugin_Settings_UrlOverride, W.Plugin_Settings_UrlOverrideInfo, this.URI.href);
        //(this.Settings.url as Text).Subscribe(value => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url) || /^https:\/\/www\.mangacopy\.com\/comic\/[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').at(-1);
        const { results: { comic } } = await FetchJSON<APIResponse<APISingleComic>>(this.CreateApiRequest(`/api/v3/comic2/${id}`));
        return new Manga(this, provider, comic.path_word, comic.name.trim());
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
        try {
            const request = this.CreateApiRequest(`/api/v3/comics?ordering=-datetime_updated&limit=50&offset=${page * 50}`);
            const data = await FetchJSON<APIResponse<APIResultList<APIComic>>>(request);
            return data.results.list.map(item => new Manga(this, provider, item.path_word, item.name.trim()));
        } catch { // TODO: Do not return empty list for generic errors
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { results } = await FetchJSON<APIResponse<string>>(this.CreateApiRequest(`/comicdetail/${manga.Identifier}/chapters`));
        const { groups: { default: { chapters } } } = await this.Decrypt<APIChapters>(results);
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [dataElement] = await FetchCSS<HTMLDivElement>(new Request(new URL(`/comic/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI)), '.imageData');
        const imageData = dataElement.getAttribute('contentKey');
        const images = await this.Decrypt<APIPage[]>(imageData);
        return images.map(image => new Page(this, chapter, new URL(image.url)));
    }

    private async Decrypt<T>(encryptedData: string): Promise<T> {
        const encrypted = GetBytesFromHex(encryptedData.substring(16, encryptedData.length));
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromUTF8(encryptedData.substring(0, 16)) };
        const key = await crypto.subtle.importKey('raw', this.keyData, algorithm, false, [ 'decrypt' ]);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return JSON.parse(new TextDecoder().decode(decrypted)) as T;
    }

    private CreateApiRequest(pathname: string): Request {
        return new Request(new URL(pathname, this.URI), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        });
    }
}