import { Tags } from '../Tags';
import icon from './LikeManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type ChapterData = {
    list_chap : string
}

const pagescript = `
    new Promise(resolve => {
        const tokenElement = document.querySelector("div.reading input#next_img_token");
        if (tokenElement != null) {
            const imgCdnUrl = document.querySelector("div.reading #currentlink").getAttribute("value");
            const imgdata = JSON.parse(atob(parseJwt(tokenElement.getAttribute('value')).data)); 
            resolve(imgdata.map(image => new URL(image, imgCdnUrl).href));
        }
        const images = [...document.querySelectorAll("div.reading-detail.box_doc img")].filter(element => element.dataset.index);
        resolve(images.map(image => image.getAttribute('src')));
    });
`;

@Common.MangaCSS(/^{origin}\/.*-\d+\/$/, 'h1#title-detail-manga')
@Common.MangasMultiPageCSS('?act=home&pageNum={page}', 'div.card-body p.card-text a')
@Common.PagesSinglePageJS(pagescript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('likemanga', 'LikeManga', 'https://likemanga.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
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
        const request = new Request(uri.href);
        const response: ChapterData = await FetchJSON(request);
        const data = new DOMParser().parseFromString(response.list_chap, 'text/html');
        const nodes = [...data.querySelectorAll<HTMLAnchorElement>('li.wp-manga-chapter a')];
        return nodes.map(element => new Chapter(this, manga, new URL(element.href, request.url).pathname, element.text.trim()));
    }

}
