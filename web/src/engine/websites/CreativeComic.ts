import { Tags } from '../Tags';
import icon from './CreativeComic.webp';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { type Priority } from '../taskpool/TaskPool';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';

const uuidScript = `
    new Promise (resolve =>{
        resolve ({ uuid : localStorage.getItem('uuid'), accessToken : localStorage.getItem('accessToken')});
    });
`;

type TokenData = {
    uuid: string;
    accessToken: string;
};

type APIResult<T> = {
    data: T;
};

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    id: number;
    name: string;
};

type APIChapters = {
    chapters: {
        id: number;
        vol_name: string;
    }[]
};

type APIPages = {
    chapter: {
        proportion: {
            id: number;
        }[]
    }
};

type PageKey = {
    key: string;
};

type IvAndKey = {
    key: string;
    iv: string;
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.creative-comic.tw';
    private uuid: string = undefined;
    private accessToken: string;

    public constructor() {
        super('creativecomic', 'Creative Comic', 'https://www.creative-comic.tw', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: update token and uuid after manual website interaction (i.e login)
        const { uuid, accessToken } = await FetchWindowScript<TokenData>(new Request(this.URI), uuidScript, 500);
        this.uuid = uuid;
        this.accessToken = accessToken ?? 'freeforccc2020reading';
    };

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/book/\\d+/content`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, name } = await this.FetchAPI<APIManga>(`/book/${url.match(/\/book\/(\d+)/).at(1)}/info`);
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./book?page=1&rows_per_page=99999&sort_by=updated_at&class=2');
        return data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./book/${manga.Identifier}/chapter`);
        return chapters.map(({ id, vol_name: vol }) => new Chapter(this, manga, `${id}`, vol));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { proportion } } = await this.FetchAPI<APIPages>(`./book/chapter/${chapter.Identifier}`);
        return proportion.map(({ id }) => new Page(this, chapter, new URL(`./book/chapter/image/${id}`, this.apiUrl)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            //get image crypted key
            const { key: imageKey } = await this.FetchAPI<PageKey>(page.Link.href);
            // Decrypt image key and iv using access token.
            const { iv, key } = await this.GetRealKey(imageKey, this.accessToken);
            const encryptedPage = await (await Fetch(new Request(new URL(`./fs/chapter_content/encrypt/${page.Link.href.match(/\d+$/).at(-1)}/2`, this.URI)))).arrayBuffer();
            const b64image = await this.AESDecrypt(encryptedPage, key, iv);
            return (await fetch(b64image)).blob();
        }, priority, signal);
    }

    private async Token2key(token: string): Promise<IvAndKey> {
        const hash = await crypto.subtle.digest({ name: 'SHA-512' }, GetBytesFromUTF8(token));
        const t = GetHexFromBytes(new Uint8Array(hash));
        return {
            key: t.slice(0, 64),
            iv: t.slice(30, 62)
        };
    }

    private async GetRealKey(imageKey: string, token: string): Promise<IvAndKey> {
        const { iv, key } = await this.Token2key(token);
        const decryptionData = (await this.AESDecrypt(imageKey, key, iv)).split(':');
        return {
            key: decryptionData[0],
            iv: decryptionData[1]
        };
    }

    private async AESDecrypt(message: string | ArrayBuffer, key: string, iv: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const AESkey = await crypto.subtle.importKey('raw', GetBytesFromHex(key), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, AESkey, typeof message == 'string'? GetBytesFromBase64(message) : message);
        return new TextDecoder().decode(decrypted);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                device: 'web_desktop',
                uuid: this.uuid,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        }))).data;
    }
}