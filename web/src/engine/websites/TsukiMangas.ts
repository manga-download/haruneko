import { Tags } from '../Tags';
import icon from './TsukiMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
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

type PageParameters = {
    mirrors: string[],
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/api/v3/`;
    public constructor() {
        super('tsukimangas', 'Tsuki-Mangas', 'https://tsuki-mangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/obra/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-2);
        const { title } = await FetchJSON<APIManga>(this.CreateRequest(`mangas/${mangaId}`));
        return new Manga(this, provider, mangaId, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(this.CreateRequest(`home/lastests?page=${page}?format=0`));
        return data.map(manga => new Manga(this, provider, manga.id.toString(), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    public async GetChaptersFromPage(manga: Manga, page : number): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(this.CreateRequest(`chapters?manga_id=${manga.Identifier}&page=${page}&order=desc`));
        return data.map(chapter => {
            const title = chapter.title ? [chapter.number, chapter.title].join(' : ') : chapter.number;
            return new Chapter(this, manga, chapter.id.toString(), title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pages } = await FetchJSON<APIChapter>(this.CreateRequest(`chapter/versions/${chapter.Identifier}`));
        return pages?.map(page => {
            return new Page<PageParameters>(this, chapter, new URL(`https://cdn.tsuki-mangas.com/tsuki${page.url}`), {
                mirrors: [
                    new URL(page.url, 'https://cdn2.tsuki-mangas.com').href
                ]
            });
        }) ?? [];
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            for (const uri of [page.Link, ...page.Parameters.mirrors]) {
                try {
                    const request = new Request(uri, { signal: signal, headers: { Referer: this.URI.href } });
                    const response = await Fetch(request);
                    if (response.headers.get('Content-Type').startsWith('image/')) {
                        return response.blob();
                    }
                } catch { }
            }
        }, priority, signal);
    }

    private CreateRequest(endpoint: string): Request {
        return new Request(new URL(endpoint, this.apiUrl), { headers: { Referer: this.URI.origin } });
    }

}