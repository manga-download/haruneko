import { Tags } from '../Tags';
import icon from './Mangacix.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { RandomBytes } from '../Random';
import { GetBase64FromBytes, GetBytesFromUTF8 } from '../BufferEncoder';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    pagination: {
        data: APIManga[];
    };
};

type APIManga = {
    id: number;
    name: string;
    episodes: {
        id: number;
        name: string;
        episode_number: number;
    }[];
    episode_images: {
        url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/secure/`;

    public constructor() {
        super('mangacix', 'Mangacix', 'https://mangacix.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/books/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title: { id, name } } = await this.FetchAPI<{ title: APIManga }>(`./titles/${url.match(/\/books\/(\d+)/).at(1)}`);
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { pagination: { data } } = await this.FetchAPI<APIMangas>(`./titles?page=${page}&perPage=500`);
                const mangas = data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { title: { episodes } } = await this.FetchAPI<{ title: APIManga }>(`./titles/${manga.Identifier}`);
        return episodes.map(({ episode_number: number, name }) => new Chapter(this, manga, `${number}`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { title: { episode_images } } = await this.FetchAPI<{ title: APIManga }>(`./titles/${chapter.Parent.Identifier}?episodeNumber=${chapter.Identifier}`);
        return episode_images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const requestUrl = new URL(endpoint, this.apiURL);
        const { ciphertext, iv } = await this.AESEncrypt(requestUrl.search.replace(/^\?/, ''), GetBytesFromUTF8('i4C7R2fXGocdYgFLzCbDlsJjukf8G58b'));
        return FetchJSON<T>(new Request(requestUrl, {
            headers: {
                'X-E-H': `${ciphertext}.${iv}`
            }
        }));
    }

    private async AESEncrypt(data: string, keyData: Uint8Array<ArrayBuffer>) {
        const iv = RandomBytes(12);
        const result = await crypto.subtle.encrypt({ name: 'AES-GCM', iv },
            await crypto.subtle.importKey('raw', keyData, {
                name: 'AES-GCM', length: 256
            }, false, ['encrypt']), GetBytesFromUTF8(`{version}${data}`));
        return {
            ciphertext: GetBase64FromBytes(new Uint8Array(result)),
            iv: GetBase64FromBytes(iv)
        };
    }
}