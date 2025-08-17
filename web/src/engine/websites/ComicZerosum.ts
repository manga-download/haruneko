import { Tags } from '../Tags';
import icon from './ComicZerosum.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto } from '../platform/FetchProvider';
import protoTypes from './ComicZerosum.proto?raw';

type APISingleTitle = {
    title: APITitle
};

type APITitles = {
    titles: APITitle[]
};

type APITitle = {
    tag: string,
    name: string
};

type TitleView = {
    title: APITitle,
    chapters: APIChapter[]
};

type APIChapter = {
    id: number,
    name: string,
};

type APIPages = {
    pages: {
        imageUrl: string
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.zerosumonline.com/api/v1/';

    public constructor() {
        super('comiczerosum', `Comic ゼロサム (Comic ZEROSUM)`, 'https://zerosumonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title: { tag, name } } = await this.FetchAPI<APISingleTitle>(`./title?tag=${url.split('/').at(-1)}`, 'ComicZerosum.TitleView');
        return new Manga(this, provider, tag, name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { titles } = await this.FetchAPI<APITitles>('./list?category=series&sort=date', 'ComicZerosum.Listview');
        return titles.map(({ tag, name }) => new Manga(this, provider, tag, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<TitleView>(`./title?tag=${manga.Identifier}`, 'ComicZerosum.TitleView');
        return chapters.map(({ id, name }) => new Chapter(this, manga, id.toString(), name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./viewer?chapter_id=${chapter.Identifier}`, 'ComicZerosum.MangaViewerView', 'POST');
        return pages.filter(page => page.imageUrl).map(({imageUrl}) => new Page(this, chapter, new URL(imageUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, messageType: string, method: string = 'GET'): Promise<T> {
        return FetchProto<T>(new Request(new URL(endpoint, this.apiUrl), { method }), protoTypes, messageType);
    }
}
