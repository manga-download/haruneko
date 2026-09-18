import { Tags } from '../Tags';
import icon from './KomikuCOM.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    title: string;
};

type APIMangas = {
    items: APIManga[];
    totalPages: number;
};

type APIChapter = {
    id: number;
    n: number;
    title: string;
    pages: {
        url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v2/`;

    public constructor() {
        super('komikucom', 'Komiku.COM', 'https://01.komiku.asia', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchJSON<APIManga>(new Request(new URL(`./comics/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items, totalPages } = await FetchJSON<APIMangas>(new Request(new URL(`./comics?perPage=500&page=${page}`, this.apiURL)));
                const mangas = items.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                yield* mangas;
                run = page < totalPages;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./comics/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.map(({ title, id }) => new Chapter(this, manga, `${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIChapter>(new Request(new URL(`./comics/${chapter.Parent.Identifier}/chapters/id/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}