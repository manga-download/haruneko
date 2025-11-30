import { Tags } from '../Tags';
import icon from './TheBlank.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { RandomHex } from '../Random';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';

type APIMangas = {
    series: {
        data: APIManga[];
    }
};

type APIManga = {
    slug: string;
    title: string;
    chapters?: {
        slug: string;
        title: string;
    }[]
};

type APIChapters = {
    props: {
        serie: APIManga;
    }
};

type APIPages = {
    props: {
        signed_urls: string[];
    }
};

type RSAParameters = {
    keyPair: CryptoKeyPair;
    publicKeyBase64: string;
};

type PageData = {
    key: string;
};

export default class extends DecoratableMangaScraper {
    #token: null | string = null;
    private version: string = undefined;

    public constructor() {
        super('theblank', 'TheBlank', 'https://beta.theblank.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        const [token, version] = await FetchWindowScript<string[]>(new Request(this.URI), `
            new Promise(async (resolve, reject) => {
                try {
                    const {version} = JSON.parse(document.querySelector('#app').dataset.page);
                    resolve([  (await cookieStore.get('XSRF-TOKEN'))?.value, version ]);
                } catch (err) {
                    reject(err);
                }
            });
        `, 750);
        this.#token = token;
        this.version = version;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { series: { data } } = await this.FetchAPI<APIMangas>(`./library?page=${page}`);
                const mangas = data?.map(({ slug, title }) => new Manga(this, provider, slug, title)) ?? [];
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { props: { serie: { chapters } } } = await this.FetchAPI<APIChapters>(`./serie/${manga.Identifier}`, {
            'X-Inertia': 'true',
            'X-Inertia-Version': this.version
        });
        return chapters?.map(({ slug, title }) => new Chapter(this, manga, slug, title)) ?? [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const chapterURL = new URL(`./serie/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.URI)
        const csrfToken = (await FetchCSS<HTMLMetaElement>(new Request(chapterURL), 'meta[name="csrf-token"]'))[0].content;

        //get images urls
        const { props: { signed_urls } } = await this.FetchAPI<APIPages>(chapterURL.pathname, {
            'X-Inertia': 'true',
            'X-Inertia-Version': this.version
        });

        const key = await this.GenerateImageKey(csrfToken, chapterURL.href);
        return signed_urls.map(url => new Page<PageData>(this, chapter, new URL(url, this.URI)), { key });
    }

    private async GenerateImageKey(csrfToken: string, referer: string): Promise<string> {

        //generate RSA keys
        const { publicKeyBase64, keyPair: { privateKey } } = await this.GenerateKeyPair();

        //fetch session id using generated pubkey
        const { sid } = await FetchJSON<{ sid: string }>(new Request(new URL('./api/v1/session', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Origin: this.URI.origin,
                Referer: referer
            },
            body: JSON.stringify({
                clientPublicKey: publicKeyBase64,
                nonce: this.GenerateNonce()
            })
        }));

        const value = this.CookSID(sid);
        return this.RSADecrypt(privateKey, value);
    }

    private GenerateNonce(): string {
        const L0 = Math.floor(Date.now() / 1000).toString(16).padStart(16, '0');
        const x0 = new Uint8Array(24);
        window.crypto.getRandomValues(x0);
        const vA = Array.from(x0).map(j0 => j0.toString(16).padStart(2, '0')).join('');
        return L0 + vA;
    }

    private async RSADecrypt(key: CryptoKey, buffer: ArrayBuffer): Promise<string> {
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
        }, key, buffer);
        return new TextDecoder().decode(decrypted);
    }

    private CookSID(sid: string): ArrayBuffer {
        let L0 = sid.replace(/-/g, '+').replace(/_/g, '/');
        for (; L0.length % 4;) L0 += '=';
        const x0 = atob(L0),
            vA = new Uint8Array(x0.length);
        for (let j0 = 0; j0 < x0.length; j0++) vA[j0] = x0.charCodeAt(j0);
        return vA.buffer;
    }

    private async GenerateKeyPair(): Promise<RSAParameters> {
        const cryptoKey = await window.crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
        }, !0, [
            'encrypt',
            'decrypt'
        ]);
        const keyBuffer = await window.crypto.subtle.exportKey('spki', cryptoKey.publicKey);
        const x0 = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)));
        return {
            keyPair: cryptoKey,
            publicKeyBase64: x0
        };
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            //fetch image > get data and HEADER ['x-stream-header'];
            const response = await Fetch(new Request(page.Link));
            const header = response.headers.get('x-stream-header');
            const imageData = await response.arrayBuffer();

            const nonce = Uint8Array.from(atob(header), f => f.charCodeAt(0)); //create M from HEADER
            const key = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(page.Parameters.key)));
            return GetTypedData(await this.DecryptImage(imageData, key, nonce));
        }, priority, signal);
    }

    private async DecryptImage(buffer: ArrayBuffer, streamKey: Uint8Array, nonce: Uint8Array): Promise<ArrayBuffer> {
        //await ag.ready;
        const imageArray = new Uint8Array(buffer);
        const X0 = ag.crypto_secretstream_xchacha20poly1305_init_pull(nonce , streamKey);
        const H = [];

        let position = 0;
        const chunkSize = 8192 + 17; //ag.crypto_secretstream_xchacha20poly1305_ABYTES;
        for (; position < imageArray.length;) {
            const chunk = imageArray.slice(position, position + chunkSize);
            const L0 = ag.crypto_secretstream_xchacha20poly1305_pull(X0, chunk);
            if (!L0) throw new Error('Decryption failed - invalid or corrupted data');
            const {
                message: x0,
                tag: vA
            } = L0;
            if (H.push(x0), vA === ag.crypto_secretstream_xchacha20poly1305_TAG_FINAL) break;
            position += chunk.length;
        }
        const g2 = H.reduce((first, second) => first + second.length, 0),
            finalArray = new Uint8Array(g2);
        let P = 0;
        for (const R0 of H) {
            finalArray.set(R0, P);
            P += R0.length;
        }
        return finalArray.buffer;
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string, headers: HeadersInit = undefined): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.URI), {
            headers: {
                ...headers,
                'X-XSRF-TOKEN': this.#token,
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));
    }

}