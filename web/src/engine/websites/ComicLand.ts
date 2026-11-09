import { Tags } from '../Tags';
import icon from './ComicLand.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    slug: string;
    title: string;
    chapters: {
        chapter_index: number;
        title: string;
    }[];
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.comicland.org/api/';

    public constructor() {
        super('comicland', 'ComicLand', 'https://comicland.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./comic/detail?slug=${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 500) {
                const { list } = await this.FetchAPI<{ list: APIManga[]; }>(`./comics?offset=${offset}&limit=500`);
                const mangas = list.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./comic/detail?slug=${manga.Identifier}`);
        return chapters.map(({ chapter_index: id, title }) => new Chapter(this, manga, `${id}`, title)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./chapter/pages_by_index?slug=${chapter.Parent.Identifier}&index=${chapter.Identifier}`);
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return (await FetchJSON<APIResult<T>>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        }))).data;
    }
}