import { Tags } from '../Tags';
import icon from './Manga168.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: string;
    title: string;
};

type APIMangaDetails = APIResult<{
    id_manga: number;
    post_title: string;
    ero_chapters: APIChapter[];
}>;

type APIChapter = {
    ero_chapter: string;
    post_title: string;
};

type APIMangas = APIResult<APIManga[]>;
type APIPages = APIResult<string[]>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/manga/`;

    public constructor() {
        super('manga168', 'Manga168', 'https://manga168x.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id_manga: id, post_title: title } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./mangas/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run ; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?limit=500&page=${page}`, this.apiURL)));
                const mangas = data.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { ero_chapters: chapters } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./mangas/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ ero_chapter: id, post_title: title }) => new Chapter(this, manga, `${id}`, title.replace(manga.Title, '').trim() || title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./mangas/${chapter.Parent.Identifier}/${chapter.Identifier}/images`, this.apiURL)));
        return data.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
    }
}