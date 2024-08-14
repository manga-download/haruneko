import { FetchCSS } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLImageElement>('img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'section img.object-cover', (element: HTMLImageElement) => element.alt.trim())
@Common.MangasMultiPageCSS('/manga?page={page}', 'div#card-real a', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('div#chapter-container img.chapter-image')
@Common.ImageAjax()
export class FuzzyDoodle extends DecoratableMangaScraper {

    protected queryChapters = 'div#chapters-list a';

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL(`${manga.Identifier}?page=${page}`, this.URI);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(uri), this.queryChapters);
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('span').innerText.trim()));
    }
}