import { Tags } from '../Tags';
import icon from './MangaUp.webp';
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
        super('mangaup', `MangaUp`, `https:///global.manga-up.com`, Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.split('/').pop();
        const data = await FetchWindowScript<NEXTDATA<APIManga>>(new Request(new URL(`/manga/${mangaid}`, this.URI)), '__NEXT_DATA__', 2000);
        return new Manga(this, provider, mangaid, data.props.pageProps.data.titleName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<NEXTDATA<APIMangas>>(new Request(new URL('/search', this.URI)), '__NEXT_DATA__', 2000);
        return data.props.pageProps.data.titles.map(manga => new Manga(this, provider, manga.titleId, manga.titleName.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchWindowScript<NEXTDATA<APIManga>>(new Request(new URL(`/manga/${manga.Identifier}`, this.URI)), '__NEXT_DATA__', 2000);
        return data.props.pageProps.data.chapters.map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.mainName.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript<NEXTDATA<APIPages>>(new Request(new URL(`/manga/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), '__NEXT_DATA__', 2000);
        if (!data.props.pageProps.data)
            throw new Exception(W.Plugin_Common_Chapter_UnavailableError);
        return data.props.pageProps.data.pages.map(image => new Page(this, chapter, new URL(image.imageUrl)));
    }
}