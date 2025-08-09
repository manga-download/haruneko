import { Tags } from '../Tags';
import icon from './ToCoronaEx.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetBytesFromBase64 } from '../BufferEncoder';

type APIResults<T> = {
    next_cursor: null | string,
    resources: T
};

type APIManga = {
    id: string,
    title: string
};

type APIMangas = APIResults<APIManga[]>;

type APIChapters = APIResults<{
    id: string,
    title: string,
    episode_order: number
}[]>;

type APIPages = {
    pages: {
        page_image_url: string,
        drm_hash: string
    }[]
};

type PageParameters = {
    drm_hash : string
}

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.to-corona-ex.com/';
    private readonly apiKey= 'K4FWy7Iqott9mrw37hDKfZ2gcLOwO-kiLHTwXT8ad1E=';

    public constructor() {
        super('to-corona-ex', 'コロナ (to-corona-ex)', 'https://to-corona-ex.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = new URL(url).pathname.match(/\/comics\/(\d+)/).at(-1);
        const { id, title } = await this.FetchAPI<APIManga>(`./comics/${mangaId}`);
        return new Manga(this, provider, id, title.replace('@COMIC', '').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const basePath = `./comics?order=asc&sort=title_yomigana`;
        let endpoint = basePath;

        for (let run = true; run;) {
            const { resources, next_cursor } = await this.FetchAPI<APIMangas>(endpoint);
            const mangas = resources.map(manga => new Manga(this, provider, manga.id, manga.title.replace('@COMIC', '').trim()));
            mangaList.push(...mangas);
            endpoint = `${basePath}&after_than=${next_cursor}`;
            run = !!next_cursor;
        }

        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const basePath = `./episodes?comic_id=${manga.Identifier}&episode_status=free_viewing%2Conly_for_subscription&order=asc&sort=episode_order`;
        let endpoint = basePath;

        for (let run = true; run;) {
            const { resources, next_cursor } = await this.FetchAPI<APIChapters>(endpoint);
            const chapters = resources.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.trim()));
            chapterList.push(...chapters);
            endpoint = `${basePath}&after_than=${next_cursor}`;
            run = !!next_cursor;
        }

        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./episodes/${chapter.Identifier}/begin_reading`);
        return pages.map(page => new Page(this, chapter, new URL(page.page_image_url), { drm_hash: page.drm_hash }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data: Blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters.drm_hash) return data;
        const { drm_hash } = page.Parameters;

        return DeScramble(data, async (image, ctx) => {
            const scrambleData = GetBytesFromBase64(drm_hash);
            const numCol = scrambleData.at(0);
            const numRow = scrambleData.at(1);
            const key = scrambleData.slice(2);
            const numPieces = numCol * numRow;
            const pieceWidth = Math.floor((image.width - image.width % 8) / numCol);
            const pieceHeight = Math.floor((image.height - image.height % 8) / numRow);

            ctx.drawImage(image, 0, 0);

            for (let index = 0; index < numPieces; index++) {
                const h = key[index],
                    p = h % numCol,
                    m = Math.floor(h / numCol),
                    g = index % numCol,
                    v = Math.floor(index / numCol);
                ctx.drawImage(image, p * pieceWidth, m * pieceHeight, pieceWidth, pieceHeight, g * pieceWidth, v * pieceHeight, pieceWidth, pieceHeight);
            }
        });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                'X-API-Environment-Key': this.apiKey
            }
        }));
    }
}