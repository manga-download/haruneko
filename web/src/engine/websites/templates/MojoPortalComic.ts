import { DecoratableMangaScraper, type Chapter, type Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

export const queryMangaTitle = '#item-detail .title-detail';
export const queryChapter = 'div.list-chapter ul li.row div.chapter a';
export const queryPages = 'div.reading div.page-chapter img';
export const path = '/?page={page}';
export const queryMangas = 'div.ModuleContent div.items div.item figcaption a.jtip';

export function PageExtractor(element: HTMLImageElement): string {
    return element.dataset.original || element.dataset.src || element.getAttribute('src');
}

@Common.MangasMultiPageCSS(path, queryMangas)
@Common.ChaptersSinglePageCSS(queryChapter)
@Common.ImageAjax(true)
export class MojoPortalComic extends DecoratableMangaScraper {
    protected pagesExcludePatterns: RegExp[] = [];
    protected queryPages = queryPages;
    protected queryChapter = queryChapter;
    protected pageExtractor = PageExtractor;

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, this.queryPages, this.pageExtractor);
        return pages.filter(page => !this.pagesExcludePatterns.some(pattern => pattern.test(page.Link.pathname)));
    }
}