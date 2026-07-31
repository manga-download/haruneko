import { FetchCSS } from '../../platform/FetchProvider';
import { type DecoratableMangaScraper, type MangaPlugin, type Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

export const queryMangaTitle = 'ul.manga-info :is(h1, h3)';
export const MangasLinkGenerator = Common.PatternLinkGenerator<MangaPlugin>('/manga-list.html?page={page}');
export const queryMangas = 'div.series-title a';
export const queryChapters = 'ul.list-chapters > a';
export const queryPages = 'img.chapter-img';

export function ClipBoardExtractor(element: HTMLElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(element.dataset.enc ? window.atob(element.dataset.enc) : element.textContent)
    };
}

export function AnchorExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.title || anchor.text || anchor.textContent)
    };
}
export function CleanTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').trim().replace(/- RAW/i, '').trim();
}

function ExtractSlug(manga: Manga): string {
    return manga.Identifier.match(/\/[a-zA-Z0-9]+-([^/]+)\.html$/).at(-1);
}

function TitleExtractor(link: HTMLAnchorElement): string {
    return link.title.trim() || link.text.trim();
}

/**
 * Iterate through all available pages of the {@link path} AJAX endpoint to gather all chapters for the given {@link manga}.
 * @param manga - The manga from which the chapters shall be acquired
 * @param path - A relative path to the AJAX endpoint(s) containing the chapters (may contain the `{manga}` placeholder which will be replaced with the slug provided by {@link extract})
 * @param query - A CSS selector to detect all chapter links
 * @param extract - A method to determine the slug from the identifier of the provided {@link manga}
 * @param extractTitle - A method to extract title from the element returned by {@link query} selector
 */
export async function FetchChaptersAJAX(this: DecoratableMangaScraper, manga: Manga, path: string, query: string, extract = ExtractSlug, extractTitle = TitleExtractor): Promise<Chapter[]> {
    const chapterList: Chapter[] = [];
    const uri = new URL(path.replace('{manga}', extract(manga)), this.URI);
    const init = {
        method: 'POST',
        headers: {
            'Referer': new URL(manga.Identifier, this.URI).href,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: '',
    };
    for (let page = 1, run = true; run; page++) {
        init.body = `page=${page}`;
        const links = await FetchCSS<HTMLAnchorElement>(new Request(uri, init), query);
        const chapters = links.map(link => new Chapter(this, manga, link.pathname, extractTitle(link).replace(manga.Title, '').trim()));
        chapterList.isMissingLastItemFrom(chapters) ? chapterList.push(...chapters) : run = false;
    }
    return chapterList;
}