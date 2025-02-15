import { FetchRegex, FetchCSS } from '../../platform/FetchProvider';
import { type DecoratableMangaScraper, type Manga, Chapter, Page } from '../../providers/MangaPlugin';

export const pathManga = /^{origin}\/[^/]+\.html$/;
export const queryMangaTitle = 'ul.manga-info :is(h1, h3)';
export const pathMangasMultiPage = '/manga-list.html?page={page}';
export const pathMangasSinglePage = '/manga-list.html?listType=allABC';
export const queryMangas = 'div.series-title a';
export const queryChapters = 'ul.list-chapters > a';
export const queryPages = 'img.chapter-img';

export function ExtractSlug(manga: Manga): string {
    return manga.Identifier.match(/\/[a-zA-Z0-9]+-([^/]+)\.html$/).at(-1);
}

/**
 * Iterate through all available pages of the {@link path} AJAX endpoint to gather all chapters for the given {@link manga}.
 * @param manga - The manga from which the chapters shall be acquired
 * @param path - A relative path to the AJAX endpoint(s) containing the chapters (may contain the `{manga}` placeholder which will be replaced with the slug provided by {@link extract})
 * @param query - A CSS selector to detect all chapter links
 * @param extract - A method to determine the slug from the identifier of the provided {@link manga}
 */
export async function FetchChaptersAJAX(this: DecoratableMangaScraper, manga: Manga, path: string, query: string, extract = ExtractSlug): Promise<Chapter[]> {
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
    const extractTitle = (link: HTMLAnchorElement) => (link.title.trim() || link.text.trim()).replace(manga.Title, '').trim();
    for (let page = 1, run = true; run; page++) {
        init.body = `page=${page}`;
        const links = await FetchCSS<HTMLAnchorElement>(new Request(uri, init), query);
        const chapters = links.map(link => new Chapter(this, manga, link.pathname, extractTitle(link)));
        chapterList.isMissingLastItemFrom(chapters) ? chapterList.push(...chapters) : run = false;
    }
    return chapterList;
}

/**
 * Gather all images for the given {@link chapter}.
 * 1. Extract the chapter UID from the HTML page (the URL is derived from the identifier of the {@link chapter})
 * 2. Combine the extracted chapter UID with the {@link path} to get the AJAX endpoint which contains the images
 * @param chapter - The chapter from which the images shall be acquired
 * @param pattern - A pattern to extract the chapter UID (must contain a single RegExp capture group and the modifier `g`)
 * @param path - A relative path to the AJAX endpoint(s) containing the image links (may contain the `{chapter}` placeholder which will be replaced with the ID provided by {@link pattern})
 * @param query - The CSS selector to detect all images
 * @param extract - A method to determine the pathname from an image element
 */
export async function FetchPagesAJAX(this: DecoratableMangaScraper, chapter: Chapter, pattern: RegExp, path: string, query: string, extract: (img: HTMLImageElement) => string): Promise<Page[]> {
    const request = new Request(new URL(chapter.Identifier, this.URI));
    const [ chapterID ] = await FetchRegex(request, pattern);
    const uri = new URL(path.replace('{chapter}', chapterID), this.URI);
    const images = await FetchCSS<HTMLImageElement>(new Request(uri, { headers: { Referer: request.url } }), query);
    return images.map(img => new Page(this, chapter, new URL(extract(img), this.URI), { Referer: request.url }));
}