import { Tags } from '../Tags';
import icon from './Tapread.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

const imgURL = 'https://static.tapread.com';

type APIMangas = {
    code: number
    result: {
        moreDetailList: {
            comicId: number,
            comicName: string
        }[]
    }
};

type APIChapters = {
    code: number
    result: {
        chapterList: {
            chapterNo: number,
            chapterId: number,
            chapterName: string
        }[]
    }
};

type APIPages = {
    code: number
    result: {
        imgList: {
            imgUrl: string,
        }[]
    }
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tapread', `Tapread`, 'https://www.tapread.com', Tags.Language.English, Tags.Source.Official, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/detail/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const data = await FetchCSS<HTMLDivElement>(new Request(url), 'div.book-container div.book-info div.book-name');
        return new Manga(this, provider, id, data.pop().textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/comic/moredetail?pageNo=' + page, this.URI).href;
        const request = new Request(url);
        const { code, result} = await FetchJSON<APIMangas>(request);
        return code == 200 && result ? result.moreDetailList.map(element => new Manga(this, provider, String(element.comicId), element.comicName.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL('/comic/contents?comicId=' + manga.Identifier, this.URI).href;
        const request = new Request(url);
        const { code, result: { chapterList }, result } = await FetchJSON<APIChapters>(request);
        return code == 200 && result ? chapterList.map(element => new Chapter(this, manga, String(element.chapterId), element.chapterNo + ' - ' + element.chapterName)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL('/comic/chapter?comicId=' + chapter.Parent.Identifier + '&chapterId=' + chapter.Identifier, this.URI).href;
        const request = new Request(url);
        const { code, result: { imgList }, result } = await FetchJSON<APIPages>(request);
        return code == 200 && result ? imgList.map(element => new Page(this, chapter, new URL(element.imgUrl, imgURL))) : [];
    }
}