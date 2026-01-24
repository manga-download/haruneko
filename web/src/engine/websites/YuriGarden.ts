import { Tags } from '../Tags';
import icon from './YuriGarden.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

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

type PageData = {
    url: string;
    key?: number[];
};

type PageKey = {
    key?: number[];
};

function pageScript(apiUrl: string) {
    return `
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
                            const res = await fetch('${apiUrl}chapters/' + location.pathname.split('/').pop(), {
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
}

export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://api.yurigarden.com/api/';
    private CDNUrl = 'https://db.yurigarden.com/storage/v1/object/public/yuri-garden-store/';

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
        const pages = await FetchWindowScript<PageData[]>(new Request(new URL(`./comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), pageScript(this.apiUrl));
        return pages.map(({ key, url }) => new Page<PageKey>(this, chapter, new URL(url.startsWith('http') ? url : this.CDNUrl + url), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
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
}