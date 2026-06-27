import { Tags } from '../Tags';
import icon from './MangaKio.webp';
import { Delay } from '../BackgroundTimers';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type NEXTManga = {
    props: {
        pageProps: {
            initialManga: {
                id: string;
                name: string;
            };
        }
    }
};

type APIMangas = APIResult<{
    items: {
        id: string;
        url: string;
        name: string;
        slug: string;
    }[];
}>;

type APIChapters = APIResult<{
    chapters: {
        id: string;
        name: string;
    }[];
}>;

type APIPages = APIResult<{
    chapter: {
        images: string[];
    };
}>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.mangak.io/';

    public constructor() {
        super('mangakio', 'MangaKio', 'https://mangak.io', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [{ text }] = await FetchCSS<HTMLScriptElement>(new Request(new URL(url)), 'script#__NEXT_DATA__');
        const { props: { pageProps: { initialManga: { id, name } } } } = <NEXTManga>JSON.parse(text);
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            // TODO: Improve search to avoid 10k entries limit => Move to website-titles repository
            for (let page = 1, run = true; run && page < 201; page++) {
                await Delay(500);
                const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./titles/search?limit=50&page=${page}`, this.apiURL)));
                const mangas = items.map(({ id, name }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./titles/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.map(({ id, name }) => new Chapter(this, manga, id, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { images } } } = await FetchJSON<APIPages>(new Request(new URL(`./titles/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiURL)));
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}