import { Tags } from '../Tags';
import icon from './MangaWT.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    _id: string;
    title: string;
    slug: string;
    chapters: {
        _id: string;
        number: number;
        title: string;
    }[];
};

type APIMangas = {
    mangas: APIManga[];
};

type APIPages = {
    pages: {
        signedUrl: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangawt', 'MangaWT', 'https://mangawt.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { _id, title } = await FetchJSON<APIManga>(new Request(new URL(`./mangas/slug/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, _id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?limit=9999`, this.apiURL)));
        return mangas.map(({ _id, title }) => new Manga(this, provider, _id, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./mangas/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ title, number }) => new Chapter(this, manga, `${number}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./mangas/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}/pages`, this.apiURL)));
        return pages.map(({ signedUrl }) => new Page(this, chapter, new URL(signedUrl)));
    }
}