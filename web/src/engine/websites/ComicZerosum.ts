import { Tags } from '../Tags';
import icon from './ComicZerosum.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto } from '../platform/FetchProvider';
import protoTypes from './ComicZerosum.proto?raw';

type APISingleTitle = {
    title: APITitle
}

type APITitles = {
    titles: APITitle[]
}

type APITitle = {
    id: number,
    tag: string,
    name: string
}

type TitleView = {
    title: APITitle,
    chapters: APIChapter[]
}

type APIChapter = {
    id: number,
    name: string,
    imageUrl: string
}

type APIPages = {
    pages: {
        imageUrl: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private api_url = 'https://api.zerosumonline.com/api/v1/';
    public constructor() {
        super('comiczerosum', `Comic ゼロサム (Comic ZEROSUM)`, 'https://zerosumonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/detail/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.match(/\/detail\/([\w]+)/)[1];
        const requri = new URL(`title?tag=${mangaid}`, this.api_url);
        const request = new Request(requri.href);
        const data = await FetchProto<APISingleTitle>(request, protoTypes, 'ComicZerosum.TitleView');
        return new Manga(this, provider, data.title.tag, data.title.name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('list?category=series&sort=date', this.api_url);
        const request = new Request(uri.href);
        const data = await FetchProto<APITitles>(request, protoTypes, 'ComicZerosum.Listview');
        return data.titles.map(element => {
            return new Manga(this, provider, element.tag, element.name.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`title?tag=${manga.Identifier}`, this.api_url);
        const request = new Request(uri.href);
        const data = await FetchProto<TitleView>(request, protoTypes, 'ComicZerosum.TitleView');
        return data.chapters.map(chapter => {
            return new Chapter(this, manga, String(chapter.id), chapter.name.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`viewer?chapter_id=${chapter.Identifier}`, this.api_url);
        const request = new Request(uri.href, {
            method: 'POST',
        });
        const data = await FetchProto<APIPages>(request, protoTypes, 'ComicZerosum.MangaViewerView');
        return data.pages.filter(page => page.imageUrl).map(page => new Page(this, chapter, new URL(page.imageUrl)));
    }
}
