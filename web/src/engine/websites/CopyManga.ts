import { Tags } from '../Tags';
import icon from './CopyManga.webp';
import { GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type EncryptedChapters = { results: string; };

type JSONMangas = {
    path_word: string;
    name: string;
}[];

type APIChapters = {
    groups: {
        default: {
            chapters: {
                name: string;
                id: string;
            }[]
        }
    }
};

type APIPages = { url: string; }[];

const uri = new URL('https://copy20.com');
const patternAliasDomains = [
    uri.hostname,
    'mangacopy.com',
    '2025copy.com',
].join('|').replaceAll('.', '\\.');

@Common.MangaCSS<HTMLHeadingElement>(new RegExp(`^https://(www\.)?${patternAliasDomains}/comic/[^/]+$/`), 'h6[title]', (head, uri) => ({ id: uri.pathname, title: head.title.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly keyData = GetBytesFromUTF8('op0zzpvv.nzn.ocp');

    public constructor() {
        super('copymanga', 'CopyManga', uri.origin, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
            const data = await FetchWindowScript<JSONMangas>(new Request(new URL(`./comics?ordering=-datetime_updated&limit=50&offset=${50 * page}`, this.URI)), 'free_list');
            return data.map(({ name, path_word: path }) => new Manga(this, provider, '/comic/' + path, name.trim()));
        } catch {
            return []; // TODO: Do not return empty list for generic errors
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./comicdetail/${manga.Identifier.split('/').at(-1)}/chapters`, this.URI);
        const { results } = await FetchJSON<EncryptedChapters>(new Request(uri, { headers: { 'DNTS': '3' } }));
        const { groups: { default: { chapters } } } = await this.Decrypt<APIChapters>(results);
        return chapters.map(({ id, name }) => new Chapter(this, manga, `${manga.Identifier}/chapter/${id}`, name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const imageData = await FetchWindowScript<string>(new Request(new URL(chapter.Identifier, this.URI)), 'contentKey', 500);
        const images = await this.Decrypt<APIPages>(imageData);
        return images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }

    private async Decrypt<T>(encryptedData: string): Promise<T> {
        const encrypted = GetBytesFromHex(encryptedData.slice(16, encryptedData.length));
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromUTF8(encryptedData.slice(0, 16)) };
        const key = await crypto.subtle.importKey('raw', this.keyData, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as T;
    }
}