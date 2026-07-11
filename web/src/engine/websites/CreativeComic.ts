import { Tags } from '../Tags';
import icon from './CreativeComic.webp';
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

type PageParameters = {
    EncryptionEndpoint: string;
}

class DRMProvider {

    #uuid = '';
    public get UUID() { return this.#uuid; }

    #iv: Uint8Array<ArrayBuffer>;
    //public get IV() { return this.#iv; }

    #keyData: Uint8Array<ArrayBuffer>;
    //public get KeyData() { return this.#keyData; }

    public async Update(uuid: string, token: string) {
        const hash = await SHA512(token);
        this.#uuid = uuid;
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

@Common.MangaCSS(/^{origin}\/[^/]+\/book\/\d+\/content$/, 'div.info > p.name', (p, uri) => ({ id: uri.pathname.split('/').at(-2), title: p.innerText }))
export default class extends DecoratableMangaScraper {

    #drm = new DRMProvider();
    readonly #apiURL = 'https://api.creative-comic.tw';

    public constructor() {
        super('creativecomic', 'Creative Comic', 'https://www.creative-comic.tw', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: update token and uuid after manual website interaction (i.e login)
        const { uuid, token } = await FetchWindowScript<TokenData>(new Request(new URL('/zh', this.URI)), `({
            uuid: localStorage.getItem('uuid'),
            token: localStorage.getItem('accessToken'),
        });`, 500);
        return this.#drm.Update(uuid, token ?? 'freeforccc2020reading');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.#FetchAPI<APIMangas>('/book?page=1&rows_per_page=99999&sort_by=updated_at&class=2');
        return data.map(({ id, name }) => new Manga(this, provider, `${id}`, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.#FetchAPI<APIChapters>(`/book/${manga.Identifier}/chapter`);
        return chapters.map(({ id, vol_name: vol }) => new Chapter(this, manga, `${id}`, vol));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { chapter: { proportion } } = await this.#FetchAPI<APIPages>(`/book/chapter/${chapter.Identifier}`);
        return proportion.map(({ id }) => new Page<PageParameters>(this, chapter, new URL(`/fs/chapter_content/encrypt/${id}/2`, this.URI), { EncryptionEndpoint: `/book/chapter/image/${id}` }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const encrypted = await this.imageTaskPool.Add(async () => {
            const { key } = await this.#FetchAPI<{ key: string }>(page.Parameters.EncryptionEndpoint);
            const response = await Fetch(new Request(page.Link.href));
            return { key: GetBytesFromBase64(key), image: await response.arrayBuffer() };
        }, priority, signal);

        const [keyData, iv] = (await this.#drm.Decrypt(encrypted.key)).split(':');
        const decrypted = await this.#drm.Decrypt(encrypted.image, GetBytesFromHex(iv), GetBytesFromHex(keyData));
        return Fetch(new Request(decrypted)).then(response => response.blob());
    }

    async #FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const { data } = await FetchJSON<{ data: T }>(new Request(new URL(endpoint, this.#apiURL), {
            headers: {
                Device: 'web_desktop',
                UUID: this.#drm.UUID,
                Referer: this.URI.href,
            }
        }));
        return data;
    }
}