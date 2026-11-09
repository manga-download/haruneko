import { Tags } from '../Tags';
import icon from './RawSenManga.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    series: APIManga[];
};

type APIManga = {
    slug: string;
    title: string;
    chapterList: APIChapter[];
};

type APIChapter = {
    title: string;
    url: string;
};

type APIPages = {
    pages: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://raw.senmanga.com/api/';

    public constructor() {
        super('rawsenmanga', `RawSenManga`, 'https://raw.senmanga.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('viewer', '1')`);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { series } = await FetchJSON<APIMangas>(new Request(new URL(`./directory?type=&status=&order=&page=${page}`, this.apiURL)));
                const mangas = series.map(({ slug, title }) => new Manga(this, provider, slug, title.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this))).distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapterList } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapterList.map(({ url, title }) => new Chapter(this, manga, url, title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./read/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiURL)));
        return pages.map(url => new Page(this, chapter, new URL(url)));
    }
}