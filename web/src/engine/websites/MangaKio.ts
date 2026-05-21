import { Tags } from '../Tags';
import icon from './MangaKio.webp';
import { Delay } from '../BackgroundTimers';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{
    items: APIManga[];
}>;

type JSONMangaDetails = {
    initialManga: {
        id: string;
        name: string;
    };
};

type APIChapters = APIResult<{
    chapters: APIChapter[];
}>;

type APIChapter = {
    id: string;
    name: string;
    images: string[];
};

type APIManga = {
    id: string;
    url: string;
    name: string;
    slug: string;
};

type APIPages = APIResult<{
    chapter: APIChapter;
}>;

type NEXTDATA<T> = {
    props: {
        pageProps: T;
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.mangak.io/';

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
        const { initialManga: { id, name } } = await this.GetEmbeddedJSON<JSONMangaDetails>(new URL(url));
        return new Manga(this, provider, id, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(500);
                const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./titles/search?page=${page}&limit=50`, this.apiUrl)));
                const mangas = items.map(({ id, name }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./titles/${manga.Identifier}/chapters`, this.apiUrl)));
        return chapters.map(({ id, name }) => new Chapter(this, manga, id, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapter: { images } } } = await FetchJSON<APIPages>(new Request(new URL(`./titles/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiUrl)));
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }

    private async GetEmbeddedJSON<T>(uri: URL): Promise<T> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(uri), 'script#__NEXT_DATA__');
        return (JSON.parse(script.text) as NEXTDATA<T>).props.pageProps;
    }

}