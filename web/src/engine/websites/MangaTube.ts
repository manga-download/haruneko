import { Tags } from '../Tags';
import icon from './MangaTube.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type APIResult<T> = {
    success: boolean;
    data: T;
};

type APIManga = {
    title: string;
    slug: string;
    chpFormat: string;
};

type APIChapters = {
    manga: APIManga;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    number: number;
    subNumber: number;
    name: string;
};

type APIPages = {
    chapter: {
        pages: {
            url: string;
        }[];
    };
};

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
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./search?page=${page}`, this.apiUrl)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters, manga: mangaData } = await FetchWindowScript<APIChapters>(new Request(new URL(`/series/${manga.Identifier}`, this.URI)), chapterScript, 2500);
        return chapters.map(item => new Chapter(this, manga, `${item.id}`, this.ComputeChapterTitle(mangaData, item)));
    }

    private ComputeChapterTitle(manga: APIManga, chapter: APIChapter): string {
        const { chpFormat } = manga;
        const { name, number, subNumber } = chapter;
        let title = `Kapitel ${number}`;
        if (chpFormat) {
            const chapterNumber = subNumber > 0 ? `${number}.${subNumber}` : `${number}`;
            title = chpFormat.replace('%chapter_number%', chapterNumber);
        };
        return name.length > 0 ? `${title} — ${name}` : title;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { pages } } } = await FetchJSON<APIResult<APIPages>>(new Request(new URL(`${chapter.Parent.Identifier}/chapter/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}