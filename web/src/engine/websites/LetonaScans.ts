import { Tags } from '../Tags';
import icon from './LetonaScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    contents: APIManga[];
};

type APIMangaDetails = {
    content: APIManga;
};

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    number: number;
    images: {
        url: string;
    }[]
};

type APIPages = {
    chapter: APIChapter;
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('letonascans', 'Letona Scans', 'https://letonascans.net', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { content: { slug, title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./content?slug=${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { contents } = await FetchJSON<APIMangas>(new Request(new URL('./content?limit=9999&contentType=MANGA', this.apiUrl)));
        return contents.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./chapters?slug=${manga.Identifier}&limit=9999`, this.apiUrl)));
        return chapters.map(({ number }) => new Chapter(this, manga, `/manga/${manga.Identifier}/bolum/${number}`, number.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { images } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters?slug=${chapter.Parent.Identifier}&chapterNumber=${chapter.Identifier.split('/').at(-1)}`, this.apiUrl)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}