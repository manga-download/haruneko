import { Tags } from '../Tags';
import icon from './XoxoComics.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';

function LabelExtractor(head: HTMLHeadingElement) {
    return head.textContent.replace(/ Comic/i, '').trim();
}

function ImageExtractor(img: HTMLImageElement) {
    return img.dataset.original;
}

@Common.MangaCSS(/^{origin}\/comic\/[\da-z-]+$/, 'article#item-detail > h1.title-detail', LabelExtractor)
@Common.MangasMultiPageCSS('/comic-list/alphabet?c=&page={page}', 'div.chapter > a')
@Common.PagesSinglePageCSS('div.page-chapter img', ImageExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xoxocomics', `XoxoComics`, 'https://xoxocomics.net', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    async getChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier + '?page=' + page, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.chapter > a');
        return data.map(element => new Chapter(this, manga, element.pathname + '/all', element.text.replace(manga.Title, '').trim()));
    }
}
