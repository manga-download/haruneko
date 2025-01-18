import { FetchCSS } from "../../platform/FetchProvider";
import { DecoratableMangaScraper, type Chapter, type MangaScraper } from "../../providers/MangaPlugin";
import { Page } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
export function MangaLabelExtractor(element: HTMLElement) {
    return CleanTitle(element.getAttribute('text') ? element.getAttribute('text') : element.textContent);
}

export function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.getAttribute('text') ? anchor.text : anchor.textContent)
    };
}

export function CleanTitle(title: string): string {
    title = title.replace(/\s*[~\-―〜]\s*RAW\s*\(MANGA\)\s*$/i, '').trim();
    title = title.replace(/\s*[~\-―〜]\s*(MANGA)?\s*RAW\s*$/i, '').trim();
    title = title.replace(/\(raw\)/i, '').trim();
    return title.replace(/\(manga\)/i, '').trim();
}

export function PageLinkExtractor<E extends HTMLImageElement>(this: MangaScraper, element: E): string {
    let page = element.dataset.src || element.dataset.srcset || element.dataset.original || element.src;
    try {
        page = window.atob(page);
    } catch { }
    return page.replace(/\n/g, '');
}

export const pathSinglePageManga = '/manga-list.html?listType=allABC';
const pathMultiPageManga = '/manga-list.html?page={page}';

export const queryMangaTitle = [
    'ul.manga-info h3',
    'ul.manga-info h1',
].join(',');

export const queryMangas = 'div.series-title a';
const queryChapters = 'ul.list-chapters > a';
export const queryPages = 'img.chapter-img';

export function ChapterScript(query: string = queryChapters): string {
    return `
        [...document.querySelectorAll('${query}')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.title.trim()
            };
        });
`;
}

export function PageScript(query: string = queryPages): string {
    return `
        new Promise(resolve => {
            const images = [...document.querySelectorAll('${query}')]
                .filter(element => element.alt != 'olimposcans.com' && !element.alt.includes('nicoscan'))
                .map(element => {
                    const page = element.dataset.src || element.dataset.srcset || element.dataset.original || element.src;
                    try {
                        page = window.atob(page);
                    } catch {}
                    return page.replace(/\\n/g, '');
                });
            resolve(images);
        });
    `;
}

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, queryMangaTitle, MangaLabelExtractor)
@Common.MangasMultiPageCSS(pathMultiPageManga, queryMangas, 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS(queryChapters, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()

export class FlatManga extends DecoratableMangaScraper {

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const data = await FetchCSS(request, queryPages);
        return data.map(element => {
            const link = new URL(PageLinkExtractor.call(this, element), request.url);
            return new Page(this, chapter, link, { Referer: this.URI.href });
        });
    }
}