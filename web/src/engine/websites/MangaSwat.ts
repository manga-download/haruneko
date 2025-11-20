import { Tags } from '../Tags';
import icon from './MangaSwat.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    results?: T;
};

type APIManga = {
    title: string;
    slug: string;
    id: number;
};

type APIChapter = {
    id: number;
    chapter: string;
    images: {
        image: string;
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://appswat.com/v2/api/v2/';

    public constructor() {
        super('mangaswat', 'MangaSwat', 'https://meshmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./series/${url.split('/').at(-1)}/`);
        return new Manga(this, provider, id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }
    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { results } = await this.FetchAPI<APIResult<APIManga[]>>(`./series/?page_size=200&page=${page}`);
        return !results ? []: results.map(({ id, title }) => new Manga(this, provider, id.toString(), title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { results } = await this.FetchAPI<APIResult<APIChapter[]>>(`./chapters/?page=1&serie=${manga.Identifier}&page_size=9999`);
        return !results ? [] : results.map(({ id, chapter }) => new Chapter(this, manga, id.toString(), chapter));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await this.FetchAPI<APIChapter>(`./chapters/${chapter.Identifier}/`);
        return images.map(({ image }) => new Page(this, chapter, new URL(image, this.URI)));
    }
    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }
}