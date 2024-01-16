import { Tags } from '../Tags';
import icon from './SeriManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\//, 'div.seri-img div.name')
@Common.MangasMultiPageCSS('/mangalar?page={page}', 'ul.sub-manga-list li.mangas-item > a', 1, 1, 0, Common.AnchorInfoExtractor(false, 'span.mlb-cat, span.mlb-star, span.wathced'))
@Common.PagesSinglePageCSS('div.reader-manga.chapter-pages img.chapter-pages__item')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('serimanga', `Seri Manga`, 'https://serimangas.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga ): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }
    private async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier+'?page=' + page, this.URI).href;
        const request = new Request(url);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.seri-page-list ul.spl-list li.spl-list-item > a');
        return data.map(anchor => new Chapter(this, manga, anchor.pathname, anchor.title.replace(manga.Title, '').replace('Manga Oku', '').replace(' - ', '').trim()));
    }
}