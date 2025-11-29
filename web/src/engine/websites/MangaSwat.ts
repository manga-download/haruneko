import { Tags } from '../Tags';
import icon from './MangaSwat.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    results?: T[];
};

type APIManga = {
    id: number;
    title: string;
};

type APIMangas = APIResult<APIManga>;

type APIChapters = APIResult<{
    id: number;
    chapter: string;
}>;

type APIPages = {
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
        return new Manga(this, provider, `${id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { results } = await this.FetchAPI<APIMangas>(`./series/?page_size=200&page=${page}`);
                const mangas = results?.map(({ id, title }) => new Manga(this, provider, `${id}`, title)) ?? [];
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { results } = await this.FetchAPI<APIChapters>(`./chapters/?serie=${manga.Identifier}&page_size=9999&page=1`);
        return results?.map(({ id, chapter }) => new Chapter(this, manga, `${id}`, 'الفصل: ' + chapter)) ?? [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await this.FetchAPI<APIPages>(`./chapters/${chapter.Identifier}/`);
        return images.map(({ image }) => new Page(this, chapter, new URL(image, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }
}