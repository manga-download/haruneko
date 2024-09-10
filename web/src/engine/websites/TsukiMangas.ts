import { Tags } from '../Tags';
import icon from './TsukiMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult<T> = {
    data : T
}

type APIManga = {
    id: number,
    title: string,
}

type APIChapter = {
    id: number,
    number: string,
    title: string | null
    pages?: {
        url: string,
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/api/v3/`;
    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/obra/(\\d+)/[^/]+$`);

    public constructor() {
        super('tsukimangas', 'Tsuki-Mangas', 'https://tsuki-mangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.match(this.mangaRegexp)[1];
        const { title } = await FetchJSON<APIManga>(this.CreateRequest(new URL(`mangas/${mangaId}`, this.apiUrl)));
        return new Manga(this, provider, mangaId, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        let reducer = Promise.resolve();
        const mangaList : Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            await reducer;
            reducer = new Promise(resolve => setTimeout(resolve, 500));
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(this.CreateRequest(new URL(`home/lastests?page=${page}?format=0`, this.apiUrl)));
        return data.map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    public async GetChaptersFromPage(manga: Manga, page : number): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(this.CreateRequest(new URL(`chapters?manga_id=${manga.Identifier}&page=${page}&order=desc`, this.apiUrl)));
        return data.map(chapter => {
            const title = (chapter.title ? [chapter.number, chapter.title].join(' : ') : chapter.number).trim();
            return new Chapter(this, manga, chapter.id.toString(), title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIChapter>(this.CreateRequest(new URL(`chapter/versions/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(page => {
            const alternateUrl = new URL(page.url, 'https://cdn2.tsuki-mangas.com').href;
            return new Page(this, chapter, new URL(`https://cdn.tsuki-mangas.com/tsuki${page.url}`), { alternateUrl });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        try {
            let blob: Blob = null;
            blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);

            if (blob.type.startsWith('image/')) {
                return blob;
            } else {
                page.Link.href = page.Parameters.alternateUrl as string;
                return Common.FetchImageAjax.call(this, page, priority, signal, true);
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        } catch (error) {
            page.Link.href = page.Parameters.alternateUrl as string;
            return Common.FetchImageAjax.call(this, page, priority, signal, true);
        }
    }

    private CreateRequest(endpoint: URL): Request {
        return new Request(endpoint, { headers: { Referer: this.URI.origin } });
    }

}