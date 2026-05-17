import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './YomiTranslate.webp';
import * as Common from './decorators/Common';

type APIManga = {
    id: number;
    title: string;
    slug: string;
};

type APIMangas = { series: APIManga[]; };

type APIMangaDetails = {
    series: APIManga;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    title: string;
    chapter_number: number;
};

type APIPages = {
    chapter: APIChapter;
    pages: {
        image_path: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('yomitranslate', 'Yomi Translate', 'https://yomitranslate.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { series: { slug, title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./series`, this.apiUrl)));
        return series.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${manga.Identifier}`, this.apiUrl)));
        return chapters.reverse().map(({ id, title }) => new Chapter(this, manga, `${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ image_path: image }) => new Page(this, chapter, new URL(image, this.URI)));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const { chapter: { chapter_number: chapterNumber } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return new URL(`/series/${chapter.Parent.Identifier}/chapter/${chapterNumber}`, this.URI);
    }
}