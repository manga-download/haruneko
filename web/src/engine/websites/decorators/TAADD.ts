import { FetchCSS, FetchWindowCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type Manga, Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';
export function MangaLabelExtractor(element: HTMLElement) {
    const title = ((element as HTMLMetaElement).content || element.textContent).replace(/(^\s*[Мм]анга|[Mm]anga\s*$)/, '').trim();
    return title ;
}

type LinkExtractor = (this: MangaScraper, element: HTMLElement) => string;
export function ChapterExtractor(element: HTMLAnchorElement) {
    const id = element.pathname + element.search;
    const title = element.childNodes[0].nodeValue.trim();
    return { id, title };
}

export function PageLinkExtractor(element: HTMLElement) {
    switch (element.nodeName) {
        case 'OPTION'://Most TAADD websites got a selector with options element
            return new URL((element as HTMLOptionElement).value, this.URI).href;
        case 'DIV': //Tenmanga = selector is a div full of <div option_val=url>;
            return element.getAttribute('option_val') || element.textContent;
        default: //just in case. People could always use a custom PageLinkExtractor anyway
            return element.textContent;
    }
}

export const mangaPath = '/search/?completed_series=either&page={page}';
export const queryMangaTitleFromURI = 'meta[property="og:title"]';
export const queryMangas = [
    'div.clistChr ul li div.intro h2 a',
    'a.bookname',
    'a.resultbookname',
].join(',');

export const queryChapters = [
    'div.chapter_list table tr td:first-of-type a',
    'div.chapterbox ul li a.chapter_list_a', //NineManga
].join(',');
export const queryPages = 'select#page';
export const querySubPages = 'option';
export const queryImages = [
    'img#comicpic',
    'img.manga_pic'
].join(',');

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * The purpose of this is to add search params to bypass adult warning. In case you dont need, use Common.ChaptersSinglePageCSS
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 * @param bypassNsfwWarning - add a param to the url otherwise chapters are hidden for NSFW manga
 */
async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor, bypassNsfwWarning = true): Promise<Chapter[]> {
    const url = new URL(manga.Identifier, this.URI);
    if (bypassNsfwWarning) {
        url.searchParams.set('warning', '1');
        url.searchParams.set('waring', '1'); //NineManga typo
    }

    const request = new Request(url.href);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const { id, title } = extractor.call(this, element);
        const mangaTitle = manga.Title.replace(/[*^.|$?+\-()[\]{}\\/]/g, '\\$&'); //escape special regex chars in manga name
        let finaltitle = title.replace(new RegExp(mangaTitle, 'i'), '') === '' ? title : title.replace(new RegExp(mangaTitle, 'i'), '');//replace manga title in chapter title
        finaltitle = finaltitle.replace(/\s*new$/, '').trim();
        return new Chapter(this, manga, id, finaltitle );
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * The purpose of this is to add search params to bypass adult warning. In case you dont need, use Common.ChaptersSinglePageCSS
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 * @param bypassNsfwWarning - add a param to the url otherwise chapters are hidden for NSFW manga
 */
export function ChaptersSinglePageCSS(query: string = queryChapters, extractor = ChapterExtractor, bypassNsfwWarning = true) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extractor, bypassNsfwWarning);
            }
        };
    };
}

/*************************************************
 ******** Page List Extraction Methods ************
 *************************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS.
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param queryPages_arg - A CSS selector to the element containing all subpages : Typically a <select> element
 * @param querySubPages_arg - A CSS query to match all elements from {@link queryPages_arg}. Ie. 'option'
 * @param queryImages_arg - A CSS query to locate the images in each subpage
 * @param extractSubPages - A function to extract the subpage information from a single element (found with {@link querySubPages_arg})
  * */
export async function FetchPagesMultiPagesCSS(this: MangaScraper, chapter: Chapter, queryPages_arg: string, querySubPages_arg: string, queryImages_arg: string, extractSubPages: LinkExtractor): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    let request = new Request(uri.href);
    //using FetchWindowCSS because TAADD websites have a tendency to redirect to another site for chapters page
    const data = await FetchWindowCSS<HTMLElement>(request, queryPages_arg); //Here we got the sub pages list NODES
    //There may be MORE than one page list element on the page, we need only one !
    const subpages = [...data[0].querySelectorAll(querySubPages_arg)].map(element => extractSubPages.call(this, element));

    const pagelist: Page[] = [];
    for (const subpage of subpages) {
        request = new Request(subpage);
        const imgdata = await FetchCSS<HTMLImageElement>(request, queryImages_arg);
        imgdata.map(element => {
            const picUrl = element.src;
            pagelist.push(new Page(this, chapter, new URL(picUrl, this.URI), { Referer: subpage }));
        });
    }
    return pagelist;
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param queryPages_arg - A CSS selector to the element containing all subpages : Typically a <select> element
 * @param querySubPages_arg - A CSS query to match all elements from {@link queryPages_arg}. Ie. 'option'
 * @param queryImages_arg - A CSS query to locate the images in each subpage
 * @param extractSubPages - A function to extract the subpage information from a single element (found with {@link querySubPages_arg})
 */
export function PagesMultiPageCSS(queryPages_arg: string = queryPages, querySubPages_arg: string = querySubPages, queryImages_arg: string = queryImages, extractSubPages: LinkExtractor = PageLinkExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesMultiPagesCSS.call(this, chapter, queryPages_arg, querySubPages_arg, queryImages_arg, extractSubPages );
            }
        };
    };
}
