import { Tags } from '../Tags';
import icon from './FirstKissManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest } from '../FetchProvider';

type ChapterData = {
    list_chap : string
}

@Common.MangaCSS(/^{origin}\/.*-\d+\/$/, 'h1#title-detail-manga')
@Common.MangasMultiPageCSS('?act=home&pageNum={page}', 'div.card-body p.card-text a')
@Common.PagesSinglePageCSS('div.reading-detail div.page-chapter img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('firstkiss', 'LikeManga', 'https://likemanga.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;

    }

    private async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const mangaid = manga.Identifier.match(/-(\d+)\/$/)[1];
        const uri = new URL(`?act=ajax&code=load_list_chapter&manga_id=${mangaid}&page_num=${page}`, this.URI);
        const request = new FetchRequest(uri.href);
        const response: ChapterData = await FetchJSON(request);
        const data = new DOMParser().parseFromString(response.list_chap, 'text/html');
        const nodes = [...data.querySelectorAll<HTMLAnchorElement>('li.wp-manga-chapter a')];
        return nodes.map(element => new Chapter(this, manga, new URL(element.href, request.url).pathname, element.text.trim()));
    }

}
