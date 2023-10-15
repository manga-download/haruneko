import { FetchRequest, FetchWindowCSS } from '../../FetchProvider';
import { Manga, type MangaPlugin, type MangaScraper } from '../../providers/MangaPlugin';
import * as Common from './Common';
export function MangaLabelExtractor(element: HTMLAnchorElement) {
    return element.textContent.replace(/\[.*?\]/g, '').replace(/【.*?】/g, '').trim();
}

export function PagesExtractor(element: HTMLImageElement) {
    return element.getAttribute('mydatasrc') || element.src;
}

const queryMangasPagecount = 'div#d_list_page a:nth-last-child(2)';

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param queryMatch - A regexp to filter mangas
 * @param sub - Subforum?
  */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, path: string, query: string, queryMatch: RegExp, sub = '', start = 1, step = 1, throttle = 0): Promise<Manga[]> {
    const mangaList = [];
    let reducer = Promise.resolve();

    //fetch pages count (because we must continue despites empty pages)
    const url = new URL(sub + path.replace('{page}', '1000'), this.URI).href;//great page number to make sure we get last
    const data = await FetchWindowCSS<HTMLAnchorElement>(new FetchRequest(url), queryMangasPagecount);
    const pageMaxUrl = new URL(data[0].href);
    const pageMax = parseInt(pageMaxUrl.searchParams.get('p') || pageMaxUrl.searchParams.get('nowpage'));

    for (let page = start; page < pageMax; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const url = new URL(sub + path.replace('{page}', `${page}`), this.URI).href;
        const data = await FetchWindowCSS<HTMLAnchorElement>(new FetchRequest(url), query);//If not using FetchWindowCSS we always fetch the same page
        if (!data || data.length == 0) continue;
        const mangas = data
            .filter(element => queryMatch.test(element.text))
            .map(element => {
                const title = MangaLabelExtractor.call(this, element);
                return new Manga(this, provider, element.pathname + element.search, title);
            });
        if (mangas.length > 0 && !Common.EndsWith(mangaList, mangas) ) mangaList.push(...mangas) ;
    }
    return mangaList;
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param queryMatch - A regexp to filter mangas
 * @param sub - Subforum?
 */
export function MangasMultiPageCSS(path: string, query: string, queryMatch: RegExp, sub = '', start = 1, step = 1, throttle = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, path, query, queryMatch, sub, start, step, throttle);
            }
        };
    };
}
