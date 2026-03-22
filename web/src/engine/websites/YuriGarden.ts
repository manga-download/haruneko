import { Tags } from '../Tags';
import icon from './YuriGarden.webp';
import { Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';

// TODO : Properly detect Turnstile on chapters, DONT PUSH T MASTER WITHOUT THAT

type APIMangas = {
    comics: APIManga[];
};

type APIManga = {
    id: string | number;
    title: string;
};

type APIChapter = {
    id: number;
    order: number;
    name: string;
};

type CryptedData = {
    encrypted: boolean;
    data: string;
}

type PagesData = {
    pages: {
        url: string;
        key?: string;
    }[]
};

type PageKey = {
    key?: string;
};

const pageScript = `
    new Promise(async(resolve, reject) => {
        try {
            const res = await fetch('https://api.yurigarden.com/api/chapters/pages/' + location.pathname.split('/').at(-1), {
                "credentials": "include",
                headers: {
                    "Accept": "application/json",
                    'x-app-origin': window.location.origin,
                    'x-custom-lang': 'vi'
                }
            });
            const json = await res.json();
            resolve(json);
        } catch (error) {
            reject(error);
        }
    });
`;

export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://api.yurigarden.com/api/';
    private CDNUrl = 'https://db.yurigarden.com/storage/v1/object/public/yuri-garden-store/';
    private AESKEY = 'FYgicJ8oFdIYfgLv';

    public constructor() {
        super('yurigarden', 'YuriGarden', 'https://yurigarden.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./comics/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`./comics?page=${page}&limit=30&status=all&allowR18=true`);
                const mangas = comics.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./chapters/comic/${manga.Identifier}`);
        return chapters.sort((self, other) => other.order - self.order)
            .map(({ id, order, name }) => new Chapter(this, manga, `${id}`, [order > -1 ? `Chapter ${order}` : 'OneShot', name].join(' - ').replace(/\s*-\s*$/, '')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageKey>[]> {
        // request page data within window because they have turnstile
        const response = await FetchWindowScript<CryptedData | PagesData>(new Request(new URL(`./comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), pageScript, 10_000, 60_000);
        const { pages } = !!response['encrypted'] ? JSON.parse(await this.OpenSSLMD5Decrypt(response['data'], this.AESKEY)) as PagesData : response as PagesData;
        return pages.map(({ key, url }) => new Page<PageKey>(this, chapter, new URL((url.startsWith('http') ? url : this.CDNUrl + url).replace('_credit', '')), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numRows = 10;
        const MAGIC = 4;
        return !page.Parameters.key ? blob : DeScramble(blob, async (image, ctx) => {

            const DecodedKey = this.ComputeKey(this.Base58ToNumber(page.Parameters.key.slice(5, -1)), numRows);
            const piecesOrder = this.SwapIndexAndValues(DecodedKey);
            const computedHeight = image.height - MAGIC * (numRows - 1);

            ctx.canvas.width = image.width;
            ctx.canvas.height = computedHeight;

            const piecesHeight = this.ComputePiecesHeight(computedHeight, numRows);
            const orderedPiecesHeight = piecesOrder.map(r => piecesHeight[r]);

            const piecesX = [0];
            for (let g = 0; g < orderedPiecesHeight.length; g++) piecesX[g + 1] = piecesX[g] + orderedPiecesHeight[g];
            let destX = 0;
            for (let g = 0; g < piecesOrder.length; g++) {
                const pieceIndex = piecesOrder[g];
                const sourceX = piecesX[pieceIndex] + MAGIC * pieceIndex;
                const sourceHeight = orderedPiecesHeight[pieceIndex];
                ctx.drawImage(image, 0, sourceX, image.width, sourceHeight, 0, destX, image.width, sourceHeight);
                destX += sourceHeight;
            }
        });
    }

    private ComputeKey(t: number, e: number = 10): number[] {
        const B = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
        let r = t;
        const n = Array.from({ length: e }, (a, c) => c);
        const o = [];
        for (let a = e - 1; a >= 0; a--) {
            const c = B[a];
            const i = Math.floor(r / c);
            r = r % c;
            o.push(n.splice(i, 1)[0]);
        }
        return o;
    }

    private Base58ToNumber(str: string): number {
        const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let result = 0;
        for (const char of str) {
            const index = BASE58_ALPHABET.indexOf(char);
            result = result * 58 + index;
        }
        return result;
    }

    private ComputePiecesHeight(computedHeight: number, numRows: number): number[] {
        const s = Math.floor(computedHeight / numRows),
            o = computedHeight % numRows,
            a = [];
        for (let l = 0; l < numRows; l++) a.push(s + (l < o ? 1 : 0));
        return a;
    }

    private SwapIndexAndValues(originArray: number[]): number[] {
        const newArray = Array(originArray.length).fill(0);
        for (let s = 0; s < originArray.length; s++) newArray[originArray[s]] = s;
        return newArray as number[];
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            method: 'GET',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'x-app-origin': this.URI.origin,
                'x-custom-lang': 'vi',
            },
        }));
    }

    private async OpenSSLMD5Decrypt(cipherText: string, password: string): Promise<string> {
        const ctBytes = GetBytesFromBase64(cipherText);
        const saltBytes = ctBytes.slice(8, 16);
        const cipherTextBytes = ctBytes.slice(16);

        const { key, iv } = await this.DeriveKeyAndIV(password, saltBytes);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            GetBytesFromHex(key),
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: GetBytesFromHex(iv) },
            cryptoKey,
            cipherTextBytes
        );

        return new TextDecoder().decode(decrypted);

    }

    private DeriveKeyAndIV(password: string, salt: Uint8Array): { key: string, iv: string } {
        // Helper to concatenate two arrays
        const concatArrays = (a, b) => new Uint8Array([...a, ...b]);

        const passwordBytes = GetBytesFromUTF8(password);
        const combined1 = concatArrays(passwordBytes, salt);
        const hash1 = this.MD5(combined1);

        const combined2 = concatArrays(hash1, concatArrays(passwordBytes, salt));
        const hash2 = this.MD5(combined2);

        const combined3 = concatArrays(hash2, concatArrays(passwordBytes, salt));
        const hash3 = this.MD5(combined3);

        return {
            key: GetHexFromBytes(concatArrays(hash1, hash2)), // key = hash1 || hash2
            iv: GetHexFromBytes(hash3)// iv = hash3
        };
    }

    private MD5(input: Uint8Array): Uint8Array {
        const l = input.length;

        const padded = new Uint8Array(((l + 8 >> 6) + 1) * 64);
        padded.set(input);
        padded[l] = 0x80;

        const view = new DataView(padded.buffer);
        view.setUint32(padded.length - 8, l * 8, true);

        let a0 = 0x67452301,
            b0 = 0xefcdab89,
            c0 = 0x98badcfe,
            d0 = 0x10325476;

        const s = [
            7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
        ];

        const K = Array.from({ length: 64 }, (_, i) =>
            Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)
        );

        const rotl = (x: number, c: number) => x << c | x >>> 32 - c;

        for (let i = 0; i < padded.length; i += 64) {
            const M = new Uint32Array(padded.buffer, i, 16);

            let A = a0, B = b0, C = c0, D = d0;

            for (let j = 0; j < 64; j++) {
                let F: number, g: number;

                if (j < 16) { F = B & C | ~B & D; g = j; }
                else if (j < 32) { F = D & B | ~D & C; g = (5 * j + 1) % 16; }
                else if (j < 48) { F = B ^ C ^ D; g = (3 * j + 5) % 16; }
                else { F = C ^ (B | ~D); g = 7 * j % 16; }

                const tmp = D;
                D = C;
                C = B;
                B = B + rotl(A + F + K[j] + M[g] >>> 0, s[j]) >>> 0;
                A = tmp;
            }

            a0 = a0 + A >>> 0;
            b0 = b0 + B >>> 0;
            c0 = c0 + C >>> 0;
            d0 = d0 + D >>> 0;
        }

        const out = new ArrayBuffer(16);
        const outView = new DataView(out);
        outView.setUint32(0, a0, true);
        outView.setUint32(4, b0, true);
        outView.setUint32(8, c0, true);
        outView.setUint32(12, d0, true);

        return new Uint8Array(out);
    }
}