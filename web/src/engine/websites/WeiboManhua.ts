import { Tags } from '../Tags';
import icon from './WeiboManhua.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

const apiURL = 'http://apiwap.vcomic.com';

type APIMangas = {
    code: number,
    message: string,
    data: {
        data: JSONComic[]
    }
}

type APIManga = {
    code: number,
    message: string,
    data: {
        comic: JSONComic,
        chapter_list: JSONChapter[]
    }
}

type APIChapter = {
    code: number,
    message: string,
    data: {
        chapter: JSONChapter,
        comic: JSONComic,
        json_content: JSONContent
    }
}

type JSONComic = {
    comic_id: string,
    comic_name: string,
    name: string,
  //  chapter_num: number,
};

type JSONChapter = {
    chapter_id: string,
    chapter_name: string,
    /*image_num: number,
    chapter_pay_price: string,
    chapter_pay_vcoin: number,
    charge_end_time: number,*/
};

type JSONContent = {
    header: { pageNum: number },
    page: JSONPage[]

};

type JSONPage = {
    /*image_id: string,
    image_origin_id: string,*/
    mobileWebpImgUrl: string,
    mobileImgUrl: string,
    newImgUrl : string,
    newWebpImgUrl: string,
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('weibomanhua', `微博动漫 (Weibo Manhua)`, 'http://manhua.weibo.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/c/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/\/(\d+)$/)[1];
        const uri = new URL(`/wbcomic/comic/comic_show?comic_id=${id}&_request_from=pc`, apiURL);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIManga>(request);
        const title = data.data.comic.name;
        return new Manga(this, provider, id, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(`/wbcomic/comic/filter_result?page_num=${page}&rows_num=250&cate_id=0&end_status=0&comic_pay_status=0&_request_from=pc`, apiURL);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIMangas>(request);
        return data.data.data.map(manga => new Manga(this, provider, manga.comic_id, manga.comic_name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/wbcomic/comic/comic_show?comic_id=${manga.Identifier}&_request_from=pc`, apiURL);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIManga>(request);
        return data.code == 1 ? data.data.chapter_list.map(element => new Chapter(this, manga, String(element.chapter_id), element.chapter_name)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`/wbcomic/comic/comic_play?chapter_id=${chapter.Identifier}&_request_from=pc`, apiURL);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIChapter>(request);
        return data.code == 1 ? data.data.json_content.page.map(page => new Page(this, chapter, new URL(page.newImgUrl || page.newWebpImgUrl || page.mobileImgUrl || page.mobileWebpImgUrl))) : [];
    }
}
