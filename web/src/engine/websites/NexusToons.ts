import { Tags } from '../Tags';
import icon from './MangaDex.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    title: string;
    slug: string;
    chapters: APIChapter[];
};

type APIChapter = {
    id: number;
    number: string;
    title: string | null;
};

type APIMangas = {
    data: APIManga[];
};

type APIPages = {
    pages: {
        imageUrl: string;
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://nexustoons.com/api/';

    public constructor() {
        super('nexustoons', 'Nexus Toons', 'https://nexustoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title, slug } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset+=500) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./mangas?offset=${offset}&limit=500`, this.apiUrl)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiUrl)));
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, `${id}`, [ number, title ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapter/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }
}