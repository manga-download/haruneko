import { Tags } from '../Tags';
import icon from './SekaiKomik.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    chapterNumber: number;
    title: string;
};

type APIPages = {
    pages: {
        url: string;
    }[];
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/proxy/`;

    public constructor() {
        super('sekaikomik', 'ManhwaLand (SekaiKomik)', 'https://05c.manhwaland.land', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const datas = await this.FetchAPI<APIManga[]>(`./manga?limit=50&page=${page}`);
                const mangas = datas.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./manga/${manga.Identifier}`);
        return chapters.map(({ chapterNumber, title }) => new Chapter(this, manga, `${chapterNumber}`, [`Ch. ${chapterNumber}`, title].filter(Boolean).join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./manga/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiUrl)))).data;
    }
}
