import { Tags } from '../Tags';
import icon from './CosmicScansIndonesia.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = APIResult<{
    slug: string;
    title: string;
}>;

type APIMangas = APIResult<APIManga['data'][]> & {
    cursor: {
        nextCursor: string;
    };
};

type APIChapters = APIResult<{
    chapters: {
        slug: string;
        chapterNum: string;
    }[];
}>;

type APIPages = APIResult<{
    chapters: string[];
}>;

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://cdncid.csmcscns.id/v1/';

    public constructor() {
        super('cosmicscansid', 'Cosmic Scans Indonesia', 'https://02.cosmicscans.to', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe('^https://\\d+.cosmicscans.to/series/[^/]+/$').test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { title, slug } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/mangaDetail/${url.split('/').filter(Boolean).at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor: string;
            for (let run = true; run;) {
                const { data, cursor: { nextCursor } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/allComics?limit=100&after=${cursor}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `/series/${slug}`, title));
                nextCursor ? cursor = nextCursor : run = false;
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/mangaDetail/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ slug, chapterNum }) => new Chapter(this, manga, slug, `Chapter ${chapterNum}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapters } } = await FetchJSON<APIPages>(new Request(new URL(`./manga/readingPage/${chapter.Identifier}`, this.apiURL)));
        return [...new DOMParser().parseFromString(chapters.join(''), 'text/html').querySelectorAll('img')].map(img => new Page(this, chapter, new URL(img.src, this.URI)));
    }
}