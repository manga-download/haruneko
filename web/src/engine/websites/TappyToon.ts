import { Tags } from '../Tags';
import icon from './TappyToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type NextFields = 'initialState' | 'initialProps';

type NextInitialProp = {
    pageProps: {
        comic: APIManga;
    };
};

type NextInitialState = {
    axios: {
        baseURL: string;
        headers: Record<string, string>;
    };
};

type APIManga = {
    id: number,
    title: string,
    locale: string,
    isSuperHighQualitySupported: boolean,
};

type APIChapters = {
    id: number,
    title: string,
    isAccessible: boolean,
    isFree: boolean,
    isUserUnlocked: boolean,
    isUserRented: boolean,
}[];

type APIPages = {
    files: { url: string; }[];
};

const mangaLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['fr', Tags.Language.French],
    ['de', Tags.Language.German],
]);

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private api: NextInitialState[ 'axios' ] = undefined;

    public constructor() {
        super('tappytoon', 'TappyToon', 'https://www.tappytoon.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Language.French, Tags.Language.German, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.api = (await this.FetchNextData<NextInitialState>(this.URI, 'initialState')).axios;
    }

    private CreateManga(provider: MangaPlugin, manga: APIManga): Manga {
        return new Manga(this, provider, `${manga.id}`, manga.title.trim(), mangaLanguageMap.get(manga.locale) ?? Tags.Language.English);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[a-z]{2}/book/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { pageProps: { comic } } = await this.FetchNextData<NextInitialProp>(new URL(url), 'initialProps');
        return this.CreateManga(provider, comic);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return mangaLanguageMap.keys().reduce(async (accumulator, locale) => {
            const mangas = await this.FetchAPI<APIManga[]>('./comics?locale=' + locale);
            return [ ...await accumulator, ...mangas.map(manga => this.CreateManga(provider, manga)) ];
        }, Promise.resolve<Manga[]>([]));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapters>(`./comics/${manga.Identifier}/chapters?skipAgeRestriction=true`);
        return chapters
            .filter(({ isAccessible, isFree, isUserRented, isUserUnlocked }) => isAccessible && (isFree || isUserRented || isUserUnlocked))
            .map(({ id, title }) => new Chapter(this, manga, `${id}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { isSuperHighQualitySupported } = await this.FetchAPI<APIManga>(`./comics/${chapter.Identifier}`);
        const { files } = await this.FetchAPI<APIPages>('./content-delivery/contents/manifest?' + new URLSearchParams({
            chapterId: chapter.Identifier,
            canAcceptSignedCookie: 'true',
            variant: isSuperHighQualitySupported ? 'super_high' : 'high',
        }).toString());
        return files.map(({ url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchNextData<T extends JSONObject>(url: URL, field: NextFields): Promise<T> {
        return FetchWindowScript<T>(new Request(url), `__NEXT_DATA__.props['${field}']`, 2000);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.api.baseURL), { headers: this.api.headers }));
    }
}