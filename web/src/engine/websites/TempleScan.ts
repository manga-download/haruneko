import { Tags } from '../Tags';
import icon from './TempleScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string,
    series_slug: string,
    Season?: {
        Chapter: APIChapter[]
    }[]
}

type APIChapter = {
    index: string,
    chapter_name: string,
    chapter_title: string | null
    chapter_slug: string,
    chapter_data: {
        images: string[]
    }
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.templetoons.com/api/';

    public constructor() {
        super('templescan', 'TempleScan', 'https://templetoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { series_slug, title } = await FetchJSON<APIManga>(new Request(new URL(url.match(/comic\/[^/]+$/).at(0), this.apiUrl)));
        return new Manga(this, provider, series_slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL('allComics', this.apiUrl)));
        return data.map(manga => new Manga(this, provider, manga.series_slug, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { Season } = await FetchJSON<APIManga>(new Request(new URL(`comic/${manga.Identifier}`, this.apiUrl)));
        if (!Season) return [];
        const results = Season.reduce((accumulator: Chapter[], element) => {
            const chapters = element.Chapter.map(chapter => {
                const title = chapter.chapter_title ? [chapter.chapter_name, chapter.chapter_title].join(' : ') : chapter.chapter_name;
                return new Chapter(this, manga, chapter.chapter_slug, title);
            });
            return [...accumulator, ...chapters];
        }, []);
        return results;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter_data: { images } } = await FetchJSON<APIChapter>(new Request(new URL(`comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl)));
        return images.map(image => new Page(this, chapter, new URL(image)));
    }
}