import { Tags } from '../Tags';
import icon from './YuriGarden.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    comics: APIManga[];
};

type APIManga = {
    id: number;
    title: string;
};

type APIChapters = 	{
	id: number;
	order: number;
	name: string;
}[];

type PageData = {
    url: string;
    key?: number[];
};

type PageParameters = {
    key?: number[];
};

export default class extends DecoratableMangaScraper {

    private apiURL = 'https://api.yurigarden.com/api/';
    private cdnURL = 'https://db.yurigarden.com/storage/v1/object/public/yuri-garden-store/';

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
        const chapters = await this.FetchAPI<APIChapters>(`./chapters/comic/${manga.Identifier}`);
        return chapters
            .sort((self, other) => other.order - self.order)
            .map(({ id, order, name }) => new Chapter(this, manga, `${id}`, [order > -1 ? `Chapter ${order}` : 'OneShot', name].join(' - ').replace(/\s*-\s*$/, '')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        /*
        const script = `
            new Promise((resolve, reject) => {
                const native = WebAssembly.instantiateStreaming;
                function toString() {
                    return this.name === native.name ? native.toString() : 'function ' + this.name + '() { [native code] }';
                }
                Object.defineProperty(toString, 'toString', {
                    value: toString,
                    writable: false,
                    enumerable: false,
                });
                Object.defineProperty(toString, 'prototype', {
                    value: undefined,
                    writable: false,
                    enumerable: false,
                });
                WebAssembly.instantiateStreaming = new Proxy(WebAssembly.instantiateStreaming, {
                    apply(funcNative, funcThis, funcArgs) {
                        const { instance: { exports } } = await Reflect.apply(funcNative, funcThis, funcArgs);
                        if (typeof exports.cd === 'function' && typeof exports.dc === 'function') {
                            try {
                                const uri = new URL('./chapters/' + location.pathname.split('/').at(-1), '${this.apiURL}																																');
                                const response = await fetch(uri, { headers: { 'X-App-Origin': window.location.origin, 'X-Custom-Lang': 'vi' } });
                                const data = await response.json();
                                const chapter = data.encrypted ? JSON.parse(exports.cd(data)) : data;
                                const pages = chapter.pages.map((url, key) => ({ url: url.replace('_credit', ''), key: key ? exports.dc([key]).at(0) : undefined }));
                                resolve(pages);
                            } catch (error) {
                                reject(error);
                            }
                        }
                        return { instance: { exports } };
                        return Reflect.apply(funcNative, funcThis, funcArgs);
                    },
                    get(target, key, receiver) {
                        return key === 'toString' ? toString : Reflect.get(target, key);
                    },
                });
                WebAssembly.instantiateStreaming['toString'] = 'ƒ instantiateStreaming() { [native code] }';
            });
        `;
        */
        const script = `
            new Promise(async resolve => {
                let exports = undefined;

                WebAssembly.instantiateStreaming = new Proxy(WebAssembly.instantiateStreaming, {
                    async apply(target, thisArg, args) {
                        const result = await Reflect.apply(target, thisArg, args);
                        exports = result.instance.exports;
                        const interval = setInterval(async () => {
                            try {

                                if (typeof exports.cd !== "function") return;

                                clearInterval(interval);
                                const res = await fetch('${this.apiURL}chapters/' + location.pathname.split('/').pop(), {
                                    headers: {
                                        'x-app-origin': window.location.origin,
                                        'x-custom-lang': 'vi'
                                    }
                                });
                                const json = await res.json();
                                const chapter = json.encrypted ? JSON.parse(exports.cd(json)) : json;
                                const pages = (chapter.pages || []).map(p => {
                                    return { url: p.url.replace('_credit', ''), key: p.key ? exports.dc([p.key]).at(0) : undefined };
                                });
                                resolve(pages);
                            } catch { }
                        }, 50);
                        return result;
                    }
                });
            });
        `;
        const pages = await FetchWindowScript<PageData[]>(new Request(new URL(`/comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), script);
        return pages.map(({ key, url }) => new Page<PageParameters>(this, chapter, new URL(url, this.cdnURL), { Referer: this.URI.href, key }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numRows = 10;
        const MAGIC = 4;
        return !page.Parameters.key ? blob : DeScramble(blob, async (image, ctx) => {

            const piecesOrder = this.SwapIndexAndValues(page.Parameters.key);
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
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method: 'GET',
            headers: {
                //'Origin': this.URI.origin,
                'Referer': this.URI.href,
                'X-App-Origin': this.URI.origin,
                'X-Custom-Lang': 'vi',
            },
        }));
    }
}