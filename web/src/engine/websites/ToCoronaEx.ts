import { Tags } from '../Tags';
import icon from './ToCoronaEx.webp';
import { GetBytesFromBase64 } from '../BufferEncoder';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResults<T> = {
    next_cursor: null | string;
    resources: T;
};

type APIManga = {
    id: string;
    title: string;
};

type APIMangas = APIResults<APIManga[]>;

type APIChapters = APIResults<{
    id: string;
    title: string;
    episode_order: number;
}[]>;

type APIPages = {
    pages: {
        page_image_url: string;
        drm_hash: string;
    }[]
};

type PageParameters = {
    drmHash: string
};

export default class extends DecoratableMangaScraper {

    private readonly api = {
        url: 'https://api.to-corona-ex.com/',
        headers: { 'X-API-Environment-Key': 'K4FWy7Iqott9mrw37hDKfZ2gcLOwO-kiLHTwXT8ad1E=' },
    };

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
        const { id, title } = await this.FetchAPI<APIManga>('./comics/' + url.split('/').at(-1));
        return new Manga(this, provider, id, title.replace('@COMIC', '').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const search = {
            sort: 'title_yomigana',
            order: 'asc',
        };

        for (let run = true; run;) {
            const { resources, next_cursor } = await this.FetchAPI<APIMangas>('./comics', search);
            const mangas = resources.map(({ id, title }) => new Manga(this, provider, id, title.replace('@COMIC', '').trim()));
            search[ 'after_than' ] = next_cursor;
            mangaList.push(...mangas);
            run = !!next_cursor;
        }

        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const search = {
            comic_id: manga.Identifier,
            episode_status: 'free_viewing%2Conly_for_subscription',
            sort: 'episode_order',
            order: 'asc',
        };

        for (let run = true; run;) {
            const { resources, next_cursor } = await this.FetchAPI<APIChapters>('./episodes', search);
            const chapters = resources.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.trim()));
            search[ 'after_than' ] = next_cursor;
            chapterList.push(...chapters);
            run = !!next_cursor;
        }

        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./episodes/${chapter.Identifier}/begin_reading`);
        return pages.map(page => new Page(this, chapter, new URL(page.page_image_url), { drmHash: page.drm_hash }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { drmHash } = page.Parameters;
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !drmHash ? data : DeScramble(data, async (image, ctx) => {
            const scrambleData = GetBytesFromBase64(drmHash);
            const columns = scrambleData.at(0);
            const rows = scrambleData.at(1);
            const blockIndexMap = scrambleData.slice(2);
            const blockWidth = Math.floor((image.width - image.width % 8) / columns);
            const blockHeight = Math.floor((image.height - image.height % 8) / rows);

            ctx.drawImage(image, 0, 0);

            for (let targetBlockIndex = 0; targetBlockIndex < columns * rows; targetBlockIndex++) {
                const sourceBlockIndex = blockIndexMap[ targetBlockIndex ];
                const sourceOffsetX = sourceBlockIndex % columns * blockWidth;
                const sourceOffsetY = Math.floor(sourceBlockIndex / columns) * blockHeight;
                const targetOffsetX = targetBlockIndex % columns * blockWidth;
                const targetOffsetY = Math.floor(targetBlockIndex / columns) * blockHeight;
                ctx.drawImage(image, sourceOffsetX, sourceOffsetY, blockWidth, blockHeight, targetOffsetX, targetOffsetY, blockWidth, blockHeight);
            }
        });
    }

    private async FetchAPI<T extends JSONElement>(path: string, searchParamInit: Record<string, string> = {}): Promise<T> {
        const uri = new URL(path, this.api.url);
        uri.search = new URLSearchParams(searchParamInit).toString();
        return FetchJSON<T>(new Request(uri, { headers: this.api.headers }));
    }
}