import { Tags } from '../Tags';
import icon from './YuriGarden.webp';
import { Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

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
            const res = await fetch('https://api.yurigarden.moe/api/chapters/pages/' + location.pathname.split('/').at(-1), {
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
    private apiURL = 'https://api.yurigarden.moe/api/';
    private CDNUrl = 'https://db.yurigarden.moe/storage/v1/object/public/yuri-garden-store/';
    private AESKEY = 'FYgicJ8oFdIYfgLv';

    public constructor() {
        super('yurigarden', 'YuriGarden', 'https://yurigarden.moe', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
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
        const response = await FetchWindowScript<CryptedData & PagesData>(new Request(new URL(`./comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), pageScript, 10_000, 60_000);
        const { pages } = !!response.encrypted ?
            <PagesData>JSON.parse(GetUTF8FromBytes(await this.OpenSSLMD5Decrypt(GetBytesFromBase64(response.data), this.AESKEY)))
            : <PagesData>response;
        return pages.map(({ key, url }) => new Page<PageKey>(this, chapter, new URL((url.startsWith('http') ? url : this.CDNUrl + url).replace('_credit', '')), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numRows = 10;
        const MAGIC = 4;
        return !page.Parameters.key ? blob : DeScramble(blob, async (image, ctx) => {

            const DecodedKey = this.LehmerPermutations(this.Base58ToNumber(page.Parameters.key.slice(5, -1)), numRows);
            const piecesOrder = this.SwapIndexAndValues(DecodedKey);
            const computedHeight = image.height - MAGIC * (numRows - 1);

            ctx.canvas.width = image.width;
            ctx.canvas.height = computedHeight;

            const piecesHeight = this.ComputePiecesHeight(computedHeight, numRows);
            const orderedPiecesHeight = piecesOrder.map(r => piecesHeight[r]);

            const piecesX = [0];
            for (let index = 0; index < orderedPiecesHeight.length; index++) piecesX[index + 1] = piecesX[index] + orderedPiecesHeight[index];
            let destX = 0;
            for (let index = 0; index < piecesOrder.length; index++) {
                const pieceIndex = piecesOrder[index];
                const sourceX = piecesX[pieceIndex] + MAGIC * pieceIndex;
                const sourceHeight = orderedPiecesHeight[pieceIndex];
                ctx.drawImage(image, 0, sourceX, image.width, sourceHeight, 0, destX, image.width, sourceHeight);
                destX += sourceHeight;
            }
        });
    }

    private LehmerPermutations(permutationIndex: number, keyLength: number = 10): number[] {
        const factorials: number[] = [1];

        for (let i = 1; i <= keyLength; i++) {
            factorials.push(factorials[i - 1] * i);
        }

        const availableNumbers = Array.from({ length: keyLength }, (_, index) => index);
        const resultingKey: number[] = [];
        let remainingIndex = permutationIndex;

        for (let i = keyLength - 1; i >= 0; i--) {
            const currentFactorial = factorials[i];
            const targetIndex = Math.floor(remainingIndex / currentFactorial);
            remainingIndex = remainingIndex % currentFactorial;
            const removedNumber = availableNumbers.splice(targetIndex, 1)[0];
            resultingKey.push(removedNumber);
        }
        return resultingKey;
    }

    private Base58ToNumber(str: string): number {
        return str.split('').reduce((result, char) => {
            const index = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".indexOf(char);
            return result * 58 + index;
        }, 0);
    }

    private ComputePiecesHeight(totalHeight: number, numRows: number): number[] {
        const baseHeight = Math.floor(totalHeight / numRows);
        const remainingPixels = totalHeight % numRows;
        const pieceHeights: number[] = [];

        for (let i = 0; i < numRows; i++) {
            const extraPixel = i < remainingPixels ? 1 : 0;
            pieceHeights.push(baseHeight + extraPixel);
        }
        return pieceHeights;
    }

    private SwapIndexAndValues(originArray: number[]): number[] {
        const invertedArray = Array(originArray.length).fill(0);
        originArray.forEach((targetIndex, currentIndex) => {
            invertedArray[targetIndex] = currentIndex;
        });
        return invertedArray;
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method: 'GET',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-App-Origin': this.URI.origin,
                'X-Custom-Lang': 'vi',
            },
        }));
    }

    private async OpenSSLMD5Decrypt(message: Uint8Array<ArrayBuffer>, password: string): Promise<ArrayBuffer> {
        const saltBytes = message.slice(8, 16);
        const cipherTextBytes = message.slice(16);

        const { key, iv } = this.EvpBytesToKey(password, saltBytes);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            cryptoKey,
            cipherTextBytes
        );

        return decrypted;

    }
    /** OpenSSL legacy key derivation (MD5)
     * *
     * @param data - Input string / bytes to derive key from
     * @param salt - arbitrary value
     */
    //
    private EvpBytesToKey(password: string, salt: Uint8Array<ArrayBuffer>): { key: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer> } {
        // Helper to concatenate two arrays
        const concatArrays = (a: Uint8Array<ArrayBuffer>, b: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> => {
            const out = new Uint8Array(a.length + b.length);
            out.set(a);
            out.set(b, a.length);
            return out;
        };

        const passwordBytes = GetBytesFromUTF8(password);
        const baseBuffer = concatArrays(passwordBytes, salt);

        const hashes: Uint8Array<ArrayBuffer>[] = [];
        let currentInput = baseBuffer;

        for (let i = 0; i < 3; i++) {
            const currentHash = this.MD5(currentInput);
            hashes.push(currentHash);
            currentInput = concatArrays(currentHash, baseBuffer);
        }

        const [hash1, hash2, iv] = hashes;

        return {
            key: concatArrays(hash1, hash2),
            iv: iv
        };
    }

    private MD5(input: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
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