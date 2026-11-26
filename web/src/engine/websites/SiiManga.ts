import { Tags } from '../Tags';
import icon from './SiiManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIResult<T> = {
    items: T;
    nextCursor?: string;
};

type APIManga = {
    slug: string;
    title: string;
};

type APIMangas = APIResult<APIManga[]>;

type APIChapter = {
    slug: string;
    name: string;
};

type APIChapters = APIResult<APIChapter[]>;

type HydratedPages = {
    initialPages: {
        pages: {
            url: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'section div h1.font-extrabold', (element, uri) => ({
    id: uri.pathname.split('/').filter(Boolean).at(-1),
    title: element.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/comic/`;

    public constructor() {
        super('siimanga', 'SiiManga', 'https://siikomik.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let cursor = undefined, run = true; run;) {
                const { items, nextCursor } = await FetchJSON<APIMangas>(new Request(new URL(`?limit=50${ cursor ? `&cursor=${cursor}` : ''}`, this.apiURL)));
                const mangas = items.map(({ slug, title }) => new Manga(this, provider, slug, title));
                yield* mangas; run = !!nextCursor;
                cursor = nextCursor;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await FetchJSON<APIChapters>(new Request(new URL(`${manga.Identifier}/chapters`, this.apiURL)));
        return items.map(({ slug, name }) => new Chapter(this, manga, slug, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { initialPages: { pages } } = await FetchNextJS<HydratedPages>(new Request(new URL(`/komik/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), data => 'initialPages' in data);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}