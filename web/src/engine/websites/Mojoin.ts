import { Tags } from '../Tags';
import icon from './Mojoin.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

// TODO: Update token and key after manual user interaction

type AESParams = {
    key: string;
    iv: string;
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
    data: {
        customized_number: string;
        name: string;
    }[]
};

type APIPages = {
    content: {
        url: string;
        key: string;
    }[]
};

type TokenData = {
    uuid: string;
    access_token: string;
}

type PageParameters = {
    keyData: string;
};

export default class extends DecoratableMangaScraper {
    private readonly drmProvider: DRMProvider;
    private readonly apiUrl = 'https://mojoin-api.com/';

    public constructor() {
        super('mojoin', 'Mojoin', 'https://mojoin.com', Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Official);
        this.drmProvider = new DRMProvider(this.URI);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.drmProvider.UpdateToken();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = new URL(url).pathname.match(/\/comics\/(\d+)/).at(1);
        const { id, name } = await this.FetchAPI<APIManga>(`./comics/book/info/${mangaId}`);
        return new Manga(this, provider, `${id}`, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIMangas>('./comics/book?rows_per_page=9999');
        return data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.FetchAPI<APIChapters>(`./comics/book/${manga.Identifier}/chapter?page=1&rows_per_page=9999`);
        return data.map(({ customized_number: number, name }) => new Chapter(this, manga, number, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { content } = await this.FetchAPI<APIPages>(`./comics/book/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`);
        return content.map(({ url, key: keyData }) => new Page<PageParameters>(this, chapter, new URL(url, this.URI), { keyData }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            headers: await this.drmProvider.ApplyNeededHeaders({
                device: 'web'
            }),
        });
        return (await FetchJSON<APIResult<T>>(request)).data as T;
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.drmProvider.DecryptImage(blob, page.Parameters.keyData);
    }
}

/**
 * A basic DRM manager with Mojoin specific business logic
 */
class DRMProvider {
    #defaultToken = { uuid: '', access_token: '' };
    #token: TokenData = this.#defaultToken;
    #aesParams: AESParams = { iv: '', key: '' };

    constructor(private readonly clientURI: URL) { }

    /**
     * Extract the token and uuid from website and compute the decryption key from token in case it exists
     */
    public async UpdateToken() {
        try {
            this.#token = await FetchWindowScript<TokenData>(new Request(this.clientURI), `new Promise(resolve=> resolve({ uuid: localStorage.getItem('uuid'), access_token : localStorage.getItem('access_token')}))`) ?? null;
            this.#aesParams = await this.ComputeAESParams(this.#token.access_token ?? 'freereadingcomicstar');
        } catch (error) {
            console.warn('UpdateToken()', error);
            this.#token = this.#defaultToken;
            this.#aesParams = await this.ComputeAESParams('freereadingcomicstar');
        }
    }

    /**
     * Determine the _Bearer_ and uuid extracted from the current token and add it as authorization header to the given {@link init} headers (replacing any existing authorization header).
     * In case the _Bearer_ could not be extracted from the current token the authorization header will not be added/replaced.
     */
    public async ApplyNeededHeaders(init: HeadersInit): Promise<HeadersInit> {
        const headers = new Headers(init);
        headers.set('uuid', this.#token.uuid);
        if (this.#token.access_token) {
            headers.set('Authorization', 'Bearer ' + this.#token.access_token);
        }
        return headers;
    }

    /**
     * Decrypt Image data from image blob using provider key (in base64)
     */
    public async DecryptImage(blob: Blob, base64KeyData: string): Promise<Blob> {
        const aesParamsData = await this.Decrypt(GetBytesFromBase64(base64KeyData).buffer, this.#aesParams.key, this.#aesParams.iv);
        const [imageKey, imageIv] = aesParamsData.split(':');
        const decryptedBase64ImageData = await this.Decrypt(await blob.arrayBuffer(), imageKey, imageIv);
        return (await fetch(decryptedBase64ImageData)).blob();
    }

    private async ComputeAESParams(text: string): Promise<AESParams> {
        const hash = GetHexFromBytes(new Uint8Array(await crypto.subtle.digest('SHA-512', GetBytesFromUTF8(text))));
        return {
            key: hash.slice(0, 64),
            iv: hash.slice(30, 62)
        };
    }

    private async Decrypt(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(keyData), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return new TextDecoder('utf-8').decode(decrypted);
    }
}