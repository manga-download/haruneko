import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { type Priority } from '../taskpool/TaskPool';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';

const uuidScript = `window`;

type TokenData = {
    uuid: string;
    accessToken: string;
};

type APIResult<T> = {
    data: T
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
        proportions: {
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
        const { uuid, accessToken } = await FetchWindowScript<TokenData>(new Request(new URL('/zh/', this.URI)), uuidScript, 3333);
        this.uuid = uuid;
        this.accessToken = accessToken ?? 'freeforccc2020reading';
    };

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/zh/book/\\d+/content`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, name } = await this.FetchAPI<APIManga>(`/book/${url.match(/\/book\/(\d+)/).at(1)}/info`);
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./book?page=1&rows_per_page=99999sort_by=updated_at&class=2');
        return data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./book/${manga.Identifier}/chapter`);
        return chapters.map(({ id, vol_name: vol }) => new Chapter(this, manga, `${id}`, vol));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { proportions } } = await this.FetchAPI<APIPages>(`./book/chapter/${chapter.Identifier}`);
        return proportions.map(({ id }) => new Page(this, chapter, new URL(`./book/chapter/image/${id}`, this.apiUrl)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const pageID = page.Link.href.match(/\d+$/).at(-1);
            const { key: imageKey } = await this.FetchAPI<PageKey>(page.Link.href);
            const { iv, key } = await this.GetRealKey(imageKey, this.accessToken);
            const encryptedPage = await (await Fetch(new Request(new URL(`./fs/chapter_content/encrypt/${pageID}/2`, this.URI)))).text();
            const b64image = await this.AESDecrypt(encryptedPage, key, iv);
            return (await fetch(b64image)).blob();
        }, priority, signal);
    }

    private async Token2key(token: string): Promise<IvAndKey> {
        const hash = await crypto.subtle.digest({ name: 'SHA-512' }, GetBytesFromUTF8(token));
        const t = GetHexFromBytes(new Uint8Array(hash));
        return {
            key: t.substr(0, 64),
            iv: t.substr(30, 32)
        };
    }

    private async GetRealKey(imageKey: string, token: string) {
        const { iv, key } = await this.Token2key(token);
        //const l = await this.$lib.AES.decrypt(imageKey, KeyAndIV);
        const decryptionData = (await this.AESDecrypt(imageKey, key, iv)).split(':');
        return {
            key: decryptionData[0],
            iv: decryptionData[1]
        };
    }

    private async AESDecrypt(message: string, key: string, iv: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const AESkey = await crypto.subtle.importKey('raw', GetBytesFromHex(key), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, AESkey, GetBytesFromBase64(message));
        return new TextDecoder().decode(decrypted);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                uuid: this.uuid,
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        }))).data;
    }
}