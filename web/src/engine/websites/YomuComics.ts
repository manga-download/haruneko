import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomText } from '../Random';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';
import { MD5 } from '../Crypto';

type APIMangas = {
    garimpo?: string;
};

type APIManga = {
    slug: string;
    title: string;
};

type JSONChapters = {
    id: string;
    title: string;
}[];

type APIPages = {
    chapter: {
        content: string[];
    };
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/obra\/[^/]+$/, 'main img.object-cover', (img, uri) => ({ id: uri.pathname.split('/').at(-1), title: img.alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://yomu.com.br/api/';

    public constructor() {
        super('yomucomics', 'Yomu Comics', 'https://yomu.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const result = await FetchJSON<APIMangas>(new Request(new URL('./library?page=1&limit=99999&sort=popular&type=all', this.apiURL)));
        const value = result.garimpo ?? Object.entries(result).find(([_, val]) => typeof val === 'string' && val.startsWith('U2FsdGVkX1'))?.[1];
        const mangas = <APIManga[]>JSON.parse(await this.OpenSSLDecrypt(value, 'yomu_trolling_scrapers_v1'));
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const eventName = RandomText(Math.random() * 8 + 8);

        const chapters = await FetchWindowPreloadScript<JSONChapters>(new Request(new URL(`./obra/${manga.Identifier}`, this.URI)), `
            JSON.parse = new Proxy(JSON.parse, {
                apply(target, thisArg, args) {
                    const result = Reflect.apply(target, thisArg, args);
                    if (Array.isArray(result) && result.length > 0 && result[0].number && result[0].title) {
                        setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                    }
                    return result;
                }
            });
        `, `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `, 1500);

        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { content } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters?id=${chapter.Identifier}`, this.apiURL)));
        return content.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }

    //Mimic CryptoJS OpenSSLDecrypt implementation. Its using MD5 (legacy) hashing.
    private async OpenSSLDecrypt(cipherText: string, password: string): Promise<string> {
        const ctBytes = GetBytesFromBase64(cipherText);

        // CryptoJS format: 'Salted__' (8 bytes) + salt (8 bytes) + ciphertext
        const saltBytes = ctBytes.slice(8, 16);
        const cipherTextBytes = ctBytes.slice(16);

        const passwordBytes = GetBytesFromUTF8(password);
        const { key, iv } = this.GenerateKeyAndIV(32, 16, saltBytes, passwordBytes);

        // Import key for subtle.crypto AES-CBC
        const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);

        // Decrypt using Web Crypto API
        const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, cryptoKey, cipherTextBytes);

        return GetUTF8FromBytes(decryptedBuffer);
    }

    // CryptoJS OpenSSL EVP_BytesToKey derivation (using MD5)
    private GenerateKeyAndIV(keyLen: number, ivLen: number, salt: Uint8Array, passwordBytes: Uint8Array): { key: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer> } {
        let d = new Uint8Array(0);
        let aki: Uint8Array[] = [];
        let iCurrentLength = 0;

        while (iCurrentLength < keyLen + ivLen) {
            const conc = new Uint8Array(d.length + passwordBytes.length + salt.length);
            conc.set(d, 0);
            conc.set(passwordBytes, d.length);
            conc.set(salt, d.length + passwordBytes.length);

            d = MD5(conc);
            aki.push(d);
            iCurrentLength += d.length;
        }

        let keyiv = new Uint8Array(iCurrentLength);
        let pos = 0;
        for (let chunk of aki) {
            keyiv.set(chunk, pos);
            pos += chunk.length;
        }

        return {
            key: keyiv.slice(0, keyLen),
            iv: keyiv.slice(keyLen, keyLen + ivLen)
        };
    }
}