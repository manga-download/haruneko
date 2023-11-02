import { FetchJSON, FetchRequest, FetchWindowScript } from '../../FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga } from '../../providers/MangaPlugin';
import * as Common from './Common';

type APIManga = {
    i: string,
    s: string,
}

export const defaultSearchPath = '/_search.php';
export const queryMangaTitle = 'head title';

export function ElementLabelExtractor(element: HTMLElement) {
    return element.textContent.split('|')[0].trim();
}

export const chapterScript = `
    new Promise((resolve, reject) => {
        try {
            let vm = angular.element($('[ng-app="MainApp"]')).scope().vm;
            let chapters = vm.Chapters.map(chapter => {
            return {
                id: '/read-online/' + vm.IndexName + vm.ChapterURLEncode(chapter.Chapter).replace(/-page-\\d+/, ''),
                title: (chapter.Type || 'Chapter') + ' ' + vm.ChapterDisplay(chapter.Chapter)
            }
        });
        resolve(chapters);
        } catch(error) {
            reject(error);
        }
    });
`;

export const pageScript = `
    new Promise((resolve, reject) => {
        try {
            resolve([...document.querySelectorAll('div.ImageGallery div[ng-repeat] img')].map(img => img.src));
        } catch (error) {
            reject(error);
        }
    });
`;

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using JSON.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, path = defaultSearchPath): Promise<Manga[]> {
    const url = new URL(path, this.URI);
    const request = new FetchRequest(url.href, { method: 'POST' });
    const data = await FetchJSON<APIManga[]>(request);
    return data.map(manga => new Manga(this, provider, `/manga/${manga.i}`, manga.s.trim()));
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using JSON.
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 */
export function MangasSinglePageCSS(path = defaultSearchPath) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, path);
            }
        };
    };
}

async function DoInitialize(): Promise <void> {
    const request = new FetchRequest(this.URI.href);
    return FetchWindowScript(request, `window.cookieStore.set('FullPage', 'yes')`);
}
/**
 * A class decorator that sets the cookie needed to have all page when fetching pages in Mangalife like websites.
 */
export function Initialize() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async Initialize(this: MangaScraper): Promise<void> {
                return DoInitialize.call(this);
            }
        };
    };
}