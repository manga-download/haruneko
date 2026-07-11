import { Tags } from '../Tags';
import icon from './Mojoin.webp';
import type { Priority } from '../taskpool/TaskPool';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { GetBytesFromBase64, GetBytesFromHex, GetUTF8FromBytes } from '../BufferEncoder';
import * as Common from './decorators/Common';
import { SHA512 } from '../Crypto';

type TokenData = {
    uuid: string;
    token?: string;
};

type APIMangas = {
    data: {
        id: number;
        name: string;
    }[];
};

type APIChapters = {
    data: {
        customized_number: string;
        name: string;
    }[];
};

type APIPages = {
    content: {
        url: string;
        key: string;
    }[];
};

type PageParameters = {
    EncryptionKeyData: string;
};

class DRMProvider {

    #uuid = '';
    public get UUID() { return this.#uuid; }

    #bearer = '';
    public get Bearer() { return this.#bearer; }

    #iv: Uint8Array<ArrayBuffer>;
    //public get IV() { return this.#iv; }

    #keyData: Uint8Array<ArrayBuffer>;
    //public get KeyData() { return this.#keyData; }

    public async Update(uuid: string, token: string) {
        const hash = await SHA512(token);
        this.#uuid = uuid;
        this.#bearer = `Bearer ${token}`;
        this.#iv = new Uint8Array(hash, 15, 16);
        this.#keyData = new Uint8Array(hash, 0, 32);
    }

    public async Decrypt(encrypted: BufferSource, iv = this.#iv, keyData = this.#keyData): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv };
        const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return GetUTF8FromBytes(decrypted);
    }
}

@Common.MangaCSS(/^{origin}\/comics\/\d+#?/, 'head > title', (t, uri) => ({ id: uri.pathname.split('/').at(-1), title: t.innerText.split('｜').at(0) }))
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();
    readonly #apiURL = 'https://mojoin-api.com';

    public constructor() {
        super('mojoin', 'Mojoin', 'https://mojoin.com', Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: update token and uuid after manual website interaction (i.e login)
        const { uuid, token } = await FetchWindowScript<TokenData>(new Request(this.URI), `({
            uuid: localStorage.getItem('uuid'),
            token: localStorage.getItem('access_token'),
        });`, 2500);
        await this.#drm.Update(uuid, token ?? 'freereadingcomicstar');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.#FetchAPI<APIMangas>('/comics/book?rows_per_page=9999');
        return data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.#FetchAPI<APIChapters>(`/comics/book/${manga.Identifier}/chapter?page=1&rows_per_page=9999`);
        return data.map(({ customized_number: number, name }) => new Chapter(this, manga, number, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { content } = await this.#FetchAPI<APIPages>(`/comics/book/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`);
        return content.map(({ url, key }) => new Page<PageParameters>(this, chapter, new URL(url, this.URI), { EncryptionKeyData: key }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const encrypted = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link.href));
            return response.arrayBuffer();
        }, priority, signal);

        const [keyData, iv] = (await this.#drm.Decrypt(GetBytesFromBase64(page.Parameters.EncryptionKeyData))).split(':');
        const decrypted = await this.#drm.Decrypt(encrypted, GetBytesFromHex(iv), GetBytesFromHex(keyData));
        return Fetch(new Request(decrypted)).then(response => response.blob());
    }

    async #FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const { data } = await FetchJSON<{ data: T }>(new Request(new URL(endpoint, this.#apiURL), {
            headers: {
                Device: 'web',
                UUID: this.#drm.UUID,
                Authorization: this.#drm.Bearer,
            }
        }));
        return data;
    }
}