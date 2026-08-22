import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomText } from '../Random';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

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

            d = this.MD5(conc);
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

    private MD5(data: Uint8Array): Uint8Array<ArrayBuffer> {
        // Standard MD5 block constants and transformation logic
        function safeAdd(x: number, y: number): number {
            const lsw = (x & 0xffff) + (y & 0xffff);
            const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 0xffff;
        }
        function bitRotateLeft(num: number, cnt: number): number {
            return num << cnt | num >>> 32 - cnt;
        }
        function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
            return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
        }
        function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
            return md5cmn(b & c | ~b & d, a, b, x, s, t);
        }
        function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
            return md5cmn(b & d | c & ~d, a, b, x, s, t);
        }
        function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
            return md5cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
            return md5cmn(c ^ (b | ~d), a, b, x, s, t);
        }

        // Convert Uint8Array to little-endian 32-bit words
        const nBytes = data.length;
        const nWords = ((nBytes + 8 >> 6) + 1) * 16;
        const x = new Int32Array(nWords);
        for (let i = 0; i < nBytes; i++) {
            x[i >> 2] |= (data[i] & 0xff) << i % 4 * 8;
        }
        x[nBytes >> 2] |= 0x80 << nBytes % 4 * 8;
        x[nWords - 2] = nBytes * 8;

        let a = 1732584193;
        let b = -271733879;
        let c = -1732584194;
        let d = 271733878;

        for (let i = 0; i < x.length; i += 16) {
            const oldA = a, oldB = b, oldC = c, oldD = d;

            // Round 1 (FF)
            a = md5ff(a, b, c, d, x[i], 7, -680876936);
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

            // Round 2 (GG)
            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5gg(b, c, d, a, x[i], 20, -373897302);
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

            // Round 3 (HH)
            a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5hh(d, a, b, c, x[i], 11, -358537222);
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

            // Round 4 (II)
            a = md5ii(a, b, c, d, x[i], 6, -198630844);
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safeAdd(a, oldA);
            b = safeAdd(b, oldB);
            c = safeAdd(c, oldC);
            d = safeAdd(d, oldD);
        }

        // Convert state words to a little-endian Uint8Array (16 bytes)
        const result = new Uint8Array(16);
        const words = [a, b, c, d];
        for (let i = 0; i < 4; i++) {
            const w = words[i];
            result[i * 4] = w & 0xff;
            result[i * 4 + 1] = w >> 8 & 0xff;
            result[i * 4 + 2] = w >> 16 & 0xff;
            result[i * 4 + 3] = w >>> 24 & 0xff;
        }

        return result;
    }
}