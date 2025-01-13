import { AddAntiScrapingDetection, FetchRedirection } from "../../platform/AntiScrapingDetection";
import { FetchCSS } from "../../platform/FetchProvider";
import { DecoratableMangaScraper, type Chapter, type MangaScraper } from "../../providers/MangaPlugin";
import { Page } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('ct_anti_ddos_key')`);// Sample => Mangagun, NicoManga, Rawinu, Weloma, WeloveManga
    if (result) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return FetchRedirection.Automatic;
    } else return undefined;

});

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
    let page = element.dataset.aload || element.dataset.src || element.dataset.srcset || element.dataset.original || element.dataset.pagespeedLazySrc || element.src;
    try {
        page = window.atob(page);
    } catch { }
    return page.replace(/\n/g, '');

}

export const pathSinglePageManga = '/manga-list.html?listType=allABC';
const pathMultiPageManga = '/manga-list.html?page={page}';

export const queryMangaTitle = [
    'li:last-of-type span[itemprop="name"]',
    'ul.manga-info h3',
    'ul.manga-info h1',
].join(',');

export const queryMangas = [
    'span[data-toggle="mangapop"] a',
    'div.media h3.media-heading a',
    'div.container a[data-toggle="mangapop"]',
    'div.card-body div.series-title a'
].join(',');

const queryChapters = [
    'div#tab-chapper table tr td a.chapter',
    'ul.list-chapters > a',
    'div#tab-chapper div#list-chapters span.title a.chapter'
].join(',');

export const queryPages = [
    'img.chapter-img',
    'div#chapter-content img',
    'div.chapter-content img'
].join(',');

export const chapterScript = `
    [...document.querySelectorAll('ul.list-chapters > a')].map(chapter => {
        return {
            id: chapter.pathname,
            title : chapter.title.trim()
        };
    });
`;

export const pageScript = `
    new Promise(resolve => {
        const images = [...document.querySelectorAll('${queryPages}')]
            .filter(element => element.alt != 'olimposcans.com' && !element.alt.includes('nicoscan'))
            .map(element => {
                const page = element.dataset.aload || element.dataset.src || element.dataset.srcset || element.dataset.original || element.dataset.pagespeedLazySrc || element.src;
                try {
                    page = window.atob(page);
                } catch {}
                return page.replace(/\\n/g, '');
            });
        resolve(images);
    });
`;

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