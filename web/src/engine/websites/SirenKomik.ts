import { Tags } from '../Tags';
import icon from './SirenKomik.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';

type TokenConfig = {
    authToken?: string;
    globalToken?: string;
    client?: number;
    server?: number;
}

type APIResult<T> = {
    data: T;
};

type APIMangas = {
    manga: APIManga[];
};

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[]
};

type APIChapter = {
    id: number;
    title: string;
    number: string;
    slug: string;
};

type APIPages = {
    currentChapterData: {
        images: Array<Array<string>>
    }
};

/**
 * A basic drmProvider manager with SirenKomik specific business logic
 */

class DRMProvider {

    private readonly localstoragePrefix = 'cZM1P6rkCfil';
    private readonly storageDecryptionKey = 'HIDUPJOKOWI!';
    private drmData: TokenConfig = {};

    constructor(private readonly clientURI: URL, private readonly apiUrl: URL) { };

    public async Initialize(): Promise<void> {
        this.drmData.globalToken = this.GenerateBase64UrlKey();
        await this.UpdateServerTime();
        await this.UpdateAuthToken();
    };

    /**
     * Get server and client timestamp
     */
    private async UpdateServerTime() {
        const { data: { time } } = await FetchJSON<{ data: { time: number } }>(new Request(new URL('./server-time', this.apiUrl)));
        this.drmData.server = time;
        this.drmData.client = Math.floor(Date.now() / 1000);
    }

    /**
     * Extract the Auth token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateAuthToken() {
        try {
            this.drmData.authToken = await this.LocalStorageGet('authToken');
        } catch (error) {
            console.warn('UpdateToken()', error);
            this.drmData.authToken = null;
        }
    }

    /**
     * Apply needed headers to the provided headers.
     */
    public async ApplyHeaders(init: HeadersInit): Promise<HeadersInit> {
        if (!this.drmData.server) await this.UpdateServerTime();
        const headers = new Headers(init);
        if (this.drmData.authToken) {
            headers.set('Authorization', 'Bearer ' + this.drmData.authToken);
        };
        headers.set('GlobalAuthorization', 'Bearer ' + this.drmData.globalToken);

        const signature = await this.GetSignature();
        headers.set('X-SERVER-TIME', signature.isServer);
        headers.set('X-REQUEST-SIGNATURE', signature.hmac);
        headers.set('X-REQUEST-TIMESTAMP', signature.timestamp.toString());
        headers.set('X-REQUEST-HASH', signature.text);

        return headers;
    }

    /**
     * Get a LocalStorage value (decrypted)
     * @param key - Encryption key (string)
     */
    private async LocalStorageGet(key: string): Promise<string> {
        const script = `
            new Promise( resolve =>{
                const n = parseInt(localStorage.getItem('${this.localstoragePrefix}' + '_chunks'), 10);
                if (isNaN(n)) {
                    resolve(null);
                }
                let r = '';
                for (let a = 0; a < n; a++) {
                    const t = localStorage.getItem('${this.localstoragePrefix}' + '_' + a);
                    if (t === null) {
                        resolve(null);
                    }
                    r += t;
                }
                resolve(r);
            });
        `;

        const message = await FetchWindowScript<string>(new Request(this.clientURI), script, 1500);
        const config = JSON.parse(await this.DecryptConfig(message, this.storageDecryptionKey));
        return config[key] ?? null;
    }

    /**
     * Decrypt the configuration string
     * @param message - encrypted config
     * @param keyString - decryption key
     */
    private async DecryptConfig(message: string, keyString: string): Promise<string> {
        const [ivData, cipherText] = message.split(':', 2);
        const key = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(keyString));
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(ivData) };
        const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, cryptoKey, GetBytesFromBase64(cipherText));
        return new TextDecoder().decode(decrypted);
    }

    private GenerateBase64UrlKey(size: number = 32): string {
        const n = new Uint8Array(size);
        crypto.getRandomValues(n);
        return btoa(String.fromCharCode(...n)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    /**
     * Generate signature for api request
     * @returns
     */
    private async GetSignature() {
        const timestamp = this.drmData.server + (Math.floor(Date.now() / 1000) - this.drmData.client);
        const salt = 'xyz' + '|' + timestamp + '|' + 'Feat_19_JUTA_LAPANGAN_PEKERJAAN';
        const randomString = this.GenerateBase64UrlKey();
        return {
            text: randomString,
            timestamp: timestamp,
            hmac: await this.HMAC(salt, timestamp + '.' + randomString),
            isServer: 'MzEwVFBTkbM7rcqWW_-'
        };
    }

    /**
     * Sign the message with SHA256 HMAC
     */
    private async HMAC(saltData: string, message: string): Promise<string> {
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(saltData), {
            name: 'HMAC',
            hash: 'SHA-256'
        }, false, [
            'sign'
        ]);
        const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = new URL('https://sirenkomik.xyz/api/');
    readonly #drmProvider: DRMProvider;

    public constructor() {
        super('sirenkomik', 'SirenKomik', 'https://sirenkomik.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
        this.#drmProvider = new DRMProvider(this.URI, this.apiUrl);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.#drmProvider.Initialize();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { manga } = await this.FetchAPI<APIMangas>(`./manga/list?page=${page}&per_page=12&status=All&type=All&sort=project`);
        return manga.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.map(({ slug, title }) => new Chapter(this, manga, slug, title.replace(manga.Title, '').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { currentChapterData: { images } } = await this.FetchAPI<APIPages>(`./chapter/${chapter.Identifier}`);
        return images.at(0).map(image => new Page(this, chapter, new URL(image, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            headers: await this.#drmProvider.ApplyHeaders({}),
        });
        return (await FetchJSON<APIResult<T>>(request)).data;
    }
}