import { Tags } from '../Tags';
import icon from './SekaiKomik.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{
    title: string;
    slug: string;
}[]>;

type APIChapters = APIResult<{
    chapters: {
        chapterNumber: number;
        title: string;
    }[];
}>;

type APIPages = APIResult<{
    pages: {
        url: string;
    }[];
}>;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.container h1', (h1, uri) => ({ id: uri.pathname.split('/').at(-1), title: h1.innerText.trim() }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/proxy/`;

    public constructor() {
        super('sekaikomik', 'ManhwaLand (SekaiKomik)', 'https://05c.manhwaland.land', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=50&page=${page}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ chapterNumber, title }) => new Chapter(this, manga, `${chapterNumber}`, ['Ch.', chapterNumber, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./manga/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}