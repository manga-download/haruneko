import * as Common from '../decorators/Common';
import { DecoratableMangaScraper, Manga, Page, type MangaPlugin, Chapter } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import { GetTypedData } from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../../BufferEncoder';
import { Exception } from '../../Error';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Delay } from '../../BackgroundTimers';

type APIResult<T> = {
    data: T;
};

type APIMedia = {
    title: string;
    id: number;
};

type APIPage = {
    url: string;
    size: number;
};

export class MangaToonBase extends DecoratableMangaScraper {
    private language = 'en';
    private readonly apiURL = 'https://sg.mangatoon.mobi/api/';
    private readonly mobileURL = new URL('https://h5.mangatoon.mobi');
    private udid: string = undefined;

    public override async Initialize(): Promise<void> {
        this.udid = await FetchWindowScript<string>(new Request(this.URI), `localStorage.getItem('mangatoon:udid') || null;`, 1500);
    };

    public WithLanguage(language: string): MangaToonBase {
        this.language = language;
        return this;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/${this.language}/[^/]+?content_id=\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIMedia>(`./content/detail?id=${new URL(url).searchParams.get('content_id')}`);
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                await Delay(500);
                const mangaData = await this.FetchAPI<APIMedia[]>(`./content/list?page=${page}&limit=500`);
                const mangas = mangaData.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIMedia[]>(`./content/episodes?id=${manga.Identifier}`);
        return chapters.map(({ id, title }) => new Chapter(this, manga, `${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.FetchAPI<APIPage[]>(`./cartoons/pictures?id=${chapter.Identifier}`);
        if (!pages) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        return pages.map(({ url, size }) => new Page(this, chapter, new URL(url), { size }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        console.log('api size', page.Parameters.size);
        console.log('blob size', blob.size);

        return await this.Decrypt(await blob.arrayBuffer());
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(this.GetSignedURL(endpoint), {
            headers: {
                Referer: this.mobileURL.href,
                Origin: this.mobileURL.origin
            }
        }))).data;
    }

    private GetSignedURL(endpoint: string): URL {
        const url = new URL(endpoint, this.apiURL);
        url.searchParams.set('_', `${Math.floor(Date.now())}`);
        url.searchParams.set('_webp', `true`);
        url.searchParams.set('_platform', `web`);
        url.searchParams.set('_v', `3.07.00`);
        url.searchParams.set('_language', this.language);
        url.searchParams.set('_udid', this.udid);

        const queryParams = Array.from(url.searchParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const sign = GetHexFromBytes(MD5(GetBytesFromUTF8(url.pathname + queryParams + '66c10a61bd916c23f3b33810d3785d17')));
        url.searchParams.set('sign', sign);
        return url;
    }

    private async Decrypt(sourceBuffer: ArrayBuffer): Promise<Blob> {
        const table1 = new Uint8Array([161, 158, 189, 103, 2, 8, 54, 66, 27, 65, 108, 98, 114, 215, 107, 119, 96, 242, 19, 248, 230, 72, 218, 166, 239, 246, 252, 245, 137, 179, 243, 206, 197, 236, 9, 145, 249, 225, 0, 176, 28, 13, 250, 244, 35, 48, 57, 216, 16, 127, 220, 73, 21, 224, 124, 199, 228, 85, 191, 154, 162, 140, 160, 200, 234, 50, 113, 62, 5, 229, 178, 104, 133, 195, 86, 194, 11, 42, 134, 89, 193, 120, 4, 47, 152, 192, 126, 101, 63, 196, 208, 172, 38, 163, 150, 132, 240, 112, 117, 146, 255, 118, 141, 58, 110, 41, 81, 144, 188, 88, 32, 175, 46, 59, 167, 68, 93, 139, 227, 121, 251, 182, 180, 60, 94, 136, 156, 201, 147, 29, 78, 143, 40, 109, 185, 202, 138, 164, 130, 186, 170, 31, 45, 91, 18, 173, 100, 187, 254, 39, 97, 155, 74, 111, 223, 26, 203, 34, 67, 23, 237, 177, 207, 231, 20, 204, 159, 71, 125, 80, 174, 241, 221, 92, 84, 90, 168, 122, 153, 247, 77, 213, 64, 6, 184, 10, 116, 37, 149, 129, 99, 83, 115, 123, 128, 135, 33, 70, 238, 253, 214, 56, 76, 210, 226, 44, 51, 25, 82, 157, 53, 106, 131, 148, 151, 142, 198, 183, 169, 55, 212, 95, 43, 211, 36, 75, 209, 102, 14, 171, 190, 7, 12, 105, 181, 15, 24, 61, 17, 52, 87, 222, 30, 3, 233, 232, 22, 165, 219, 79, 217, 69, 1, 235, 205, 49]);
        const table2 = new Uint8Array([39, 197, 251, 159, 23, 170, 21, 209, 188, 18, 9, 13, 212, 105, 14, 200, 43, 100, 89, 161, 62, 27, 29, 19, 239, 134, 234, 109, 24, 112, 173, 133, 95, 32, 73, 91, 35, 107, 196, 125, 226, 113, 20, 94, 81, 143, 75, 44, 151, 220, 156, 246, 117, 41, 85, 240, 122, 187, 193, 15, 189, 175, 157, 211, 37, 26, 40, 178, 243, 6, 229, 179, 202, 233, 74, 114, 154, 204, 48, 165, 57, 127, 8, 207, 65, 61, 201, 206, 86, 195, 77, 22, 110, 181, 237, 254, 97, 160, 47, 138, 69, 221, 12, 140, 70, 191, 68, 255, 180, 5, 210, 245, 250, 56, 80, 249, 205, 144, 106, 174, 166, 121, 99, 244, 162, 194, 185, 82, 53, 84, 88, 230, 214, 64, 135, 228, 42, 58, 103, 52, 158, 218, 10, 124, 46, 167, 198, 208, 216, 222, 217, 153, 155, 59, 132, 223, 98, 142, 123, 152, 90, 199, 111, 129, 76, 146, 66, 118, 172, 71, 164, 1, 219, 247, 79, 36, 28, 4, 141, 72, 50, 137, 149, 120, 139, 236, 128, 227, 38, 115, 253, 241, 83, 203, 49, 213, 238, 232, 30, 186, 182, 184, 183, 176, 16, 148, 3, 92, 130, 0, 93, 34, 54, 25, 67, 150, 33, 102, 192, 168, 242, 2, 231, 87, 252, 55, 171, 177, 136, 248, 31, 96, 119, 163, 11, 45, 7, 60, 78, 131, 147, 104, 116, 215, 225, 190, 224, 126, 63, 169, 101, 235, 145, 51, 17, 108]);

        function getLookupTable(offset: number) {
            const lookup: number[] = new Array(256).fill(0);

            const rotatedTt = new Array(256).fill(0);
            for (let i = 0; i < 256; i++) {
                const newPos = (i + offset) % 256;
                rotatedTt[newPos] = table2[i];
            }

            const s: number[] = new Array(256).fill(0);
            for (let r = 0; r < 256; r++) {
                const val = rotatedTt[r];
                s[val] = r;
            }

            for (let i = 0; i < 256; i++) {
                lookup[i] = table1[s[i]];
            }
            return lookup;
        }

        function decryptBytes(dataChunk: Uint8Array, offset: number) {
            const lookup = getLookupTable(offset);
            const result = dataChunk.map(b => lookup[b]);
            return new Uint8Array(result);
        }

        let foundOffset = -1;
        const imgData = new Uint8Array(sourceBuffer);
        const headerChk = imgData.slice(0, 4);

        for (let offset = 0; offset < 256; offset++) {
            const decryptedHeader = GetUTF8FromBytes(decryptBytes(headerChk, offset));
            if (decryptedHeader === 'RIFF') {
                foundOffset = offset;
                break;
            }
        }

        const limit = Math.min(imgData.length, 2048);
        const decryptedPart = decryptBytes(imgData.slice(0, limit), foundOffset);
        const remainder = imgData.slice(limit);

        let finalData = new Uint8Array(decryptedPart.length + remainder.length);
        finalData.set(decryptedPart, 0);
        finalData.set(remainder, decryptedPart.length);
        return GetTypedData(finalData.buffer);
    }
}

function MD5(bytes: Uint8Array): Uint8Array {
    const bitLen = bytes.length * 8;

    // 1. Padding: Calculate total length needed (multiple of 64 bytes / 512 bits)
    // Formula: original length + 1 byte (0x80) + padding bytes + 8 bytes for length
    const originalLen = bytes.length;
    const paddingLen = (64 - (originalLen + 9) % 64) % 64;
    const totalLen = originalLen + 1 + paddingLen + 8;

    const data = new Uint8Array(totalLen);
    data.set(bytes);
    data[originalLen] = 0x80; // Append single '1' bit (rest of byte is 0s)

    // Append original length in bits as a 64-bit little-endian integer at the very end
    const dv = new DataView(data.buffer);
    dv.setUint32(totalLen - 8, bitLen, true);
    // Upper 32 bits remain 0 since we only support up to 4GB arrays here

    // 2. Initialize MD5 buffers (Magic Numbers)
    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;

    // Helper functions for bitwise operations and rotations
    const rotateLeft = (x: number, n: number) => x << n | x >>> 32 - n;
    const addUnsigned = (x: number, y: number) => x + y >>> 0;

    const computeStep = (q: number, a: number, b: number, x: number, s: number, t: number) =>
        addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s), b);

    const F = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
        computeStep(b & c | ~b & d, a, b, x, s, t);

    const G = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
        computeStep(b & d | c & ~d, a, b, x, s, t);

    const H = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
        computeStep(b ^ c ^ d, a, b, x, s, t);

    const I = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
        computeStep(c ^ (b | ~d), a, b, x, s, t);

    // MD5 Constants (K) and Shift amounts (S)
    const K = new Uint32Array([
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ]);

    const S = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];

    // 3. Process data in 512-bit (64-byte) blocks
    for (let i = 0; i < data.length; i += 64) {
        const X = new Uint32Array(16);
        const block = new DataView(data.buffer, data.byteOffset + i, 64);

        for (let j = 0; j < 16; j++) {
            X[j] = block.getUint32(j * 4, true);
        }

        let a = h0, b = h1, c = h2, d = h3;

        for (let j = 0; j < 64; j++) {
            const round = j >> 4; // 0, 1, 2, or 3
            let g = 0;
            let fn = F;

            if (round === 0) {
                g = j;
                fn = F;
            } else if (round === 1) {
                g = (5 * j + 1) % 16;
                fn = G;
            } else if (round === 2) {
                g = (3 * j + 5) % 16;
                fn = H;
            } else {
                g = 7 * j % 16;
                fn = I;
            }

            const tmp = fn(a, b, c, d, X[g], S[j], K[j]);
            a = d;
            d = c;
            c = b;
            b = tmp;
        }

        h0 = addUnsigned(h0, a);
        h1 = addUnsigned(h1, b);
        h2 = addUnsigned(h2, c);
        h3 = addUnsigned(h3, d);
    }

    // 4. Output results as a 16-byte Uint8Array (Little-Endian layout)
    const out = new Uint8Array(16);
    const outDv = new DataView(out.buffer);
    outDv.setUint32(0, h0, true);
    outDv.setUint32(4, h1, true);
    outDv.setUint32(8, h2, true);
    outDv.setUint32(12, h3, true);

    return out;
}
