import { Tags } from '../Tags';
import icon from './YuriGarden.webp';
import { Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { RandomText } from '../Random';

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

type APIPages = {
    pages: {
        url: string;
        key?: string;
    }[]
};

type PageKey = {
    key?: string;
};

class PRNG {
    #state: number;
    constructor(seed: string) {
        this.#state = this.#Base58ToNumber(seed);
    }

    Sequence(length: number = 10): number[] {
        return this.#SwapIndexAndValues(this.#LehmerPermutations(this.#state, length));
    }

    #LehmerPermutations(permutationIndex: number, keyLength: number = 10): number[] {
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

    #Base58ToNumber(str: string): number {
        return str.split('').reduce((result, char) => {
            const index = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.indexOf(char);
            return result * 58 + index;
        }, 0);
    }

    #SwapIndexAndValues(originArray: number[]): number[] {
        const invertedArray = Array(originArray.length).fill(0);
        originArray.forEach((targetIndex, currentIndex) => {
            invertedArray[targetIndex] = currentIndex;
        });
        return invertedArray;
    }
}

export default class extends DecoratableMangaScraper {
    private apiURL = 'https://api.yurigarden.moe/api/';
    private CDNUrl = 'https://cdn.yurigarden.moe/storage/v1/object/public/yuri-garden-store/';
    private token = '';

    public constructor() {
        super('yurigarden', 'YuriGarden', 'https://yurigarden.moe', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.token = await FetchWindowScript(new Request(this.URI), `
            new Promise((resolve, reject) => {
                const request = indexedDB.open("manga-app", 2);

                request.onsuccess = (event) => {
                    const db = event.target.result;

                    try {
                        const tx = db.transaction("auth", "readonly");
                        const store = tx.objectStore("auth");
                        const getRequest = store.get("apiAccessToken");
                        getRequest.onsuccess = () => {
                            resolve(getRequest.result); // Resolves with the token value (or undefined if not found)
                        };

                        getRequest.onerror = () => reject(getRequest.error);
                        tx.onerror = () => reject(tx.error);

                    } catch (error) {
                        reject(error);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        `, 1500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./preview/comics/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { comics } = await this.FetchAPI<APIMangas>(`./comics?page=${page}&limit=30&full=true`);
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

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(`/comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
        const eventName = RandomText(32);
        const { pages } = await FetchWindowPreloadScript<APIPages>(new Request(chapterUrl), `
            JSON.parse = new Proxy(JSON.parse, {
                apply(target, thisArg, args) {
                    const result = Reflect.apply(target, thisArg, args);
                    try{
                        if (result.pages){
                            setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                        }
                    } catch {}
                    return result;
                }
            });
        `, `
            new Promise( resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `, 0);
        return pages.map(({ key, url }) => new Page<PageKey>(this, chapter, new URL((url.startsWith('http') ? url : this.CDNUrl + url).replace('_credit', '')), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numRows = 10;
        const MAGIC = 4;
        return !page.Parameters.key ? blob : DeScramble(blob, async (image, ctx) => {

            const piecesOrder = new PRNG(page.Parameters.key.slice(5, -1)).Sequence(numRows);
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

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-App-Origin': 'https://yurigarden.com',
                'X-Custom-Lang': 'vi',
            },
        }));
    }
}