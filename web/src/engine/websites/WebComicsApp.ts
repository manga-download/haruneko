import { Tags } from '../Tags';
import icon from './WebComicsApp.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

const apiUrl = 'https://popeye.webcomicsapp.com';

type APIChapters = {
    code: number,
    msg: string,
    data: {
        list: {
            index: number,
            chapter_id: string,
            name: string,
        }[]
    }
};

type APIPages = {
    code: number,
    msg: string,
    data: {
        pages: {
            src: string
        }[]
    }
};

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname.split('/comic/')[1].split('/')[1]; //need to strip everything but last part for api
    const title = anchor.querySelector<HTMLHeadingElement>('div.item-info h2.info-title').textContent.trim();
    return { id, title };
}

@Common.MangasMultiPageCSS('/genres/All/All/Popular/{page}', 'div.list-item a', 1, 1, 0, MangaInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webcomicsapp', `WebComicsApp`, 'https://www.webcomicsapp.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/comic/')[1].split('/')[1];
        const element = await FetchCSS<HTMLHeadingElement>(new Request(url), 'div.book-info div.card-info div.info h5');
        const title = element.pop().textContent.trim();
        return new Manga(this, provider, id, title);
    }

    //using chapter.index as identifier because api calls need manga.identifier and chapter.index
    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/api/chapter/list?manga_id=${manga.Identifier}`, apiUrl).href;
        const request = new Request(url);
        const data = await FetchJSON<APIChapters>(request);
        return data.code == 1000 ? data.data.list.map(element => new Chapter(this, manga, String(element.index), element.name)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`/api/chapter/detail?manga_id=${chapter.Parent.Identifier}&index=${chapter.Identifier}`, apiUrl).href;
        const request = new Request(url);
        const data = await FetchJSON<APIPages>(request);
        return data.code == 1000 ? data.data.pages.map(element => new Page(this, chapter, new URL(element.src))) : [];
    }

}
