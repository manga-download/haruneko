import { Tags } from '../Tags';
import icon from './MangaTube.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type APIResult<T> = {
    success: boolean,
    data: T,
}

type APIManga = {
    title: string,
    slug: string,
    chpFormat: string
}

type APIChapters = {
    manga: APIManga,
    chapters: APIChapter[]
}

type APIChapter = {
    id: number,
    number: number,
    subNumber: number,
    name: string
}

type APIPages = {
    chapter: {
        pages: {
            url: string
        }[]
    }
}

const mangaScript = 'window.laravel.route.data.manga.manga';
const chapterScript = 'window.laravel.route.data.manga';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`window.__challange ? true : false;`);
    return result ? FetchRedirection.Automatic : undefined;
});

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = new URL('/api/manga/', this.URI);

    public constructor() {
        super('mangatube', `MangaTube`, 'https://manga-tube.me', Tags.Language.German, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchWindowScript<APIManga>(new Request(url), mangaScript, 1500);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`search?page=${page}`, this.apiUrl)));
        return data.map(item => new Manga(this, provider, item.slug, item.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchWindowScript<APIChapters>(new Request(new URL(`/series/${manga.Identifier}`, this.URI)), chapterScript, 2500);
        return data.chapters.map(item => new Chapter(this, manga, item.id.toString(), this.ComputeChapterTitle(data.manga, item)));
    }

    private ComputeChapterTitle(manga: APIManga, chapter: APIChapter): string {
        let title = '';
        if (manga.chpFormat) {
            const chapterNumber = chapter.subNumber > 0 ? `${chapter.number}.${chapter.subNumber}` : chapter.number.toString();
            title = manga.chpFormat.replace('%chapter_number%', chapterNumber);
        } else title = `Kapitel ${chapter.number}`;
        return chapter.name.length > 0 ? `${title} — ${chapter.name}` : title;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { pages } } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(item => new Page(this, chapter, new URL(item.url)));
    }

}
