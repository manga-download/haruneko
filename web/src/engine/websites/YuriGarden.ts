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
    id: string | number ;
    title: string;
};

type APIChapter = {
    id: number;
    order: number;
    name: string;
};

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
    new Promise( resolve => {
        window.decodeURIComponent = new Proxy(window.decodeURIComponent, {
          apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            try{
                const jsonData = JSON.parse(result);
                if (jsonData.pages) resolve(jsonData);
            } catch{}

            return result;
          }
        });
    });
`;

export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://api.yurigarden.com/';
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
        return new Manga(this, provider, id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { comics } = await this.FetchAPI<APIMangas>(`./comics?page=${page}&limit=200&status=all&allowR18=true`);
        return comics.map(({ id, title }) => new Manga(this, provider, id.toString(), title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapter[]>(`./chapters/comic/${manga.Identifier}`);
        return chapters.map(({ id, order, name }) => new Chapter(this, manga, id.toString(), [order > -1 ? `Chapter ${order}` : 'OneShot', name].join(' - ').replace(/\s*-\s*$/, '')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageKey>[]> {
        const { pages } = await FetchWindowScript<PagesData>(new Request(new URL(`./comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), pageScript);
        return pages.filter(({ url }) => !/credit\.jp(e)?g$/.test(url))
            .map(({ key, url }) => new Page<PageKey>(this, chapter, new URL(url.startsWith('http') ? url : this.CDNUrl + url), { key, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const numRows = 10;
        const MAGIC = 4;
        return !page.Parameters.key ? blob : DeScramble(blob, async (image, ctx) => {

            const piecesOrder = this.GenerateScrambleData(this.ComputeSeed(page.Parameters.key.slice(4).slice(1, - 1)), 10);
            const newPiecesOrder = this.Reorder(piecesOrder);
            const computedHeight = image.height - MAGIC * (numRows - 1);

            ctx.canvas.width = image.width;
            ctx.canvas.height = computedHeight;

            const piecesHeight = this.ComputePiecesHeight(computedHeight, numRows);
            const orderedPiecesHeight = piecesOrder.map(r => piecesHeight[r]);

            const piecesX = [0];
            for (let g = 0; g < orderedPiecesHeight.length; g++) piecesX[g + 1] = piecesX[g] + orderedPiecesHeight[g];
            let destX = 0;
            for (let g = 0; g < newPiecesOrder.length; g++) {
                const pieceIndex = newPiecesOrder[g];
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

    private Reorder(originArray: number[]): number[] {
        const newArray = Array(originArray.length).fill(0);
        for (let s = 0; s < originArray.length; s++) newArray[originArray[s]] = s;
        return newArray as number[];
    }

    private ComputeSeed(key: string): number {
        const charset = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let n = 0;
        for (const s of key) {
            const o = charset.indexOf(s);
            n = n * 58 + o;
        }
        return n;
    }

    private GenerateScrambleData(seed: number, length = 10): number[] {
        const box = [
            1,
            1,
            2,
            6,
            24,
            120,
            720,
            5040,
            40320,
            362880,
            3628800
        ];
        const s = Array.from({ length }, (a, l) => l);
        const o = [];
        for (let a = length - 1; a >= 0; a--) {
            const l = box[a];
            const u = Math.floor(seed / l);
            seed %= l;
            o.push(s.splice(u, 1)[0]);
        }
        return o;
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            method: 'GET',
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'x-app-origin': this.URI.origin
            },
        });
        return FetchJSON<T>(request);
    }
}