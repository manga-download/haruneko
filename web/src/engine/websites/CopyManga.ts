import { Tags } from '../Tags';
import icon from './CopyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';

type APIResponse<T> = {
    code: number,
    message: string,
    results: T
};

type JSONMangas = {
    path_word: string,
    name: string
}[];

type APIChapters = {
    groups: {
        default: {
            chapters: {
                name: string,
                id: string
            }[]
        }
    }
};

type APIPage = {
    url: string
};

const primaryDomain = 'copy20.com';
const patternAliasDomains = [
    primaryDomain,
    'mangacopy.com',
    '2025copy.com',
].join('|').replaceAll('.', '\\.');

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly keyData = GetBytesFromUTF8('oppzzivv.nzm.oip');

    public constructor() {
        super('copymanga', 'CopyManga', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);

        //this.Settings.url = new Text('urloverride', W.Plugin_Settings_UrlOverride, W.Plugin_Settings_UrlOverrideInfo, this.URI.href);
        //(this.Settings.url as Text).Subscribe(value => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https://(www\.)?${patternAliasDomains}/comic/[^/]+$/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(new URL(url)), 'h6[title]')).at(0).getAttribute('title').trim();
        return new Manga(this, provider, url.split('/').at(-1), title);
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
            const request = new Request(new URL(`/comics?ordering=-datetime_updated&limit=50&offset=${page * 50}`, this.URI));
            const data = await FetchWindowScript<JSONMangas>(request, 'free_list');
            return data.map(({ name, path_word: path }) => new Manga(this, provider, path, name.trim()));

        } catch { // TODO: Do not return empty list for generic errors
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { groups: { default: { chapters } } } = await this.FetchAPI<APIChapters>(`./comicdetail/${manga.Identifier}/chapters`);
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const imageData = await FetchWindowScript<string>(new Request(new URL(`/comic/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI)), 'contentKey', 500);
        const images = await this.Decrypt<APIPage[]>(imageData);
        return images.map(image => new Page(this, chapter, new URL(image.url)));
    }

    private async Decrypt<T>(encryptedData: string): Promise<T> {
        const encrypted = GetBytesFromHex(encryptedData.substring(16, encryptedData.length));
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromUTF8(encryptedData.substring(0, 16)) };
        const key = await crypto.subtle.importKey('raw', this.keyData, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return JSON.parse(new TextDecoder().decode(decrypted)) as T;
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const { results } = await FetchJSON<APIResponse<string>>(new Request(new URL(endpoint, this.URI), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }));
        return this.Decrypt<T>(results);
    }
}