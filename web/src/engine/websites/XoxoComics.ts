import { Tags } from '../Tags';
import icon from './XoxoComics.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function LabelExtractor(head: HTMLHeadingElement) {
    return head.textContent.replace(/ Comic/i, '').trim();
}

function ImageExtractor(img: HTMLImageElement) {
    return img.dataset.original;
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'article#item-detail > h1.title-detail', LabelExtractor)
@Common.PagesSinglePageCSS('div.page-chapter img', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xoxocomics', `XoxoComics`, 'https://xoxocomic.com', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of '0abcdefghijklmnopqrstuvwxyz'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/comic-list?c=${letter}&page={page}`, 'div.chapter a');
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier + '?page=' + page, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.chapter > a');
        return data.map(element => new Chapter(this, manga, element.pathname + '/all', element.text.replace(manga.Title, '').trim()));
    }
}