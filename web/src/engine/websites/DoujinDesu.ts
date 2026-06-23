import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';

type APIResult = {
    _enc_resp_: string;
};

type APIManga = {
    chapters: APIChapter[];
    slug: string;
    title: string;
};

type APIChapter = {
    id: string;
    title: string;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://doujin.desu.xxx/api/';

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://doujin.desu.xxx', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const perPage = 500;
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += perPage) {
                const data = await this.FetchAPI<APIManga[]>(`./manga?limit=${perPage}&offset=${offset}`);
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { content_urls } = await this.FetchAPI<{ content_urls: string[] }>(`./chapters/${chapter.Identifier}`);
        return content_urls.map(url => new Page(this, chapter, this.CookUrl(url), { Referer: this.URI.href }));
    }

    private CookUrl(url: string): URL {
        return new URL(url.replace(/(?<!\/storage)\/uploads?\//, match => `/storage${match}`));
    }

    private GenerateAPIDecryptionKeys(): string[] {
        const seed = Math.floor(Date.now() / 3_600_000);
        const results: string[] = [];
        for (const value of [seed, seed - 1, seed + 1]) {
            let t = `doujindesu-scrapers-cannot-read-this-super-secret-salt-2026-v2_${value}`;
            let state = 0;
            for (let index = 0; index < t.length; index++) {
                state = (state << 5) - state + t.charCodeAt(index);
                state |= 0;
            }
            let result = '';
            state = Math.abs(state) || 123456789;
            for (let index = 0; index < 32; index++) {
                state = (state * 1664525 + 1013904223) % 4294967296;
                result += String.fromCharCode(33 + state % 93);
            }
            results.push(result);
        }
        return results;
    }

    private Decrypt<T extends JSONElement>(data: string): T {
        const keys = this.GenerateAPIDecryptionKeys();
        const buffer = GetBytesFromHex(data);
        for (const keyData of keys) {
            try {
                const key = GetBytesFromUTF8(keyData);
                const result: string[] = [];
                let state = 42;
                for (let index = 0; index < buffer.length; index++) {
                    const encodedByte = buffer[index];
                    const decoded = encodedByte ^ key[index % keyData.length] ^ index * 13 ^ state;
                    result.push(String.fromCharCode(decoded & 255));
                    state = (state + encodedByte) % 256;
                }
                return <T>JSON.parse(decodeURIComponent(result.join('')));
            } catch { }
        }
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const result = await FetchJSON<APIResult & T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'X-App-Secret': 'dfdf72051dbfdc7d76889ebd31324e74'
            }
        }));
        return result._enc_resp_ ? this.Decrypt<T>(result._enc_resp_) : result as T;
    }
}
