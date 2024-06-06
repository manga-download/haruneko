import { Tags } from '../Tags';
import icon from './MangaUpGlobal.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as W } from '../../i18n/ILocale';

type NEXTDATA<T> = {
    props: {
        pageProps: {
            data: T
        }
    }
}

type APIMangas = {
    titles: APIManga[]
}

type APIManga = {
    titleId: string,
    titleName: string,
    chapters?: APIChapter[]
}

type APIChapter = {
    id: number,
    mainName: string
}

type APIPages = {
    pages: {
        imageUrl: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaupglobal', `MangaUp (Global)`, `https://global.manga-up.com`, Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.split('/').pop();
        const data = await this.FetchNextData<APIManga>(new URL(`/manga/${mangaid}`, this.URI));
        return new Manga(this, provider, mangaid, data.titleName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await this.FetchNextData<APIMangas>(new URL('/search', this.URI));
        return data.titles.map(manga => new Manga(this, provider, manga.titleId, manga.titleName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.FetchNextData<APIManga>(new URL(`/manga/${manga.Identifier}`, this.URI));
        return data.chapters.map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.mainName.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.FetchNextData<APIPages>(new URL(`/manga/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI));
        if (!data)
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        return data.pages.map(image => new Page(this, chapter, new URL(image.imageUrl)));
    }

    private async FetchNextData<T extends JSONElement>(url: URL): Promise<T> {
        const data = await FetchWindowScript<NEXTDATA<T>>(new Request(url), '__NEXT_DATA__', 2000);
        return data.props.pageProps.data as T;
    }
}