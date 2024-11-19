import { Fetch, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import { type Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';

const pagesWithServersScript = `
    new Promise(resolve => {
        const pics = rm_h.pics.map(pic => {
            const picUrl = new URL(rm_h.reader.preparePicUrl(pic.url.replace(/^\\/\\//, 'https://')));
            return picUrl.pathname + picUrl.search;
        });
        const servers =  rm_h.servers.map(server => server.path.replace(/^\\/\\//, 'https://'));
        const mainserver = servers.shift();
        resolve( pics.map( picture => {
            const mirrors = servers.map(server => new URL(picture, server).href);
            return { url : new URL(picture, mainserver).href, mirrors };
        }));
       resolve(pics);
    });
`;

export const chapterScript = `
    new Promise(resolve => {
        resolve([...document.querySelectorAll('a.chapter-link.cp-l')].map(chapter => {
            return {
                id: chapter.pathname + chapter.search,
                title: chapter.text.trim(),
            };
        }));
    });
`;

export const queryMangas = 'div.tile div.desc h3 a';
export const queryMangaTitle = 'meta[itemprop = "name"]';
export const pathMangas = '/list?offset={page}';
export const pageMangaOffset = 70;
export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]',
].join(',');

type ImagesData = {
    url: string,
    mirrors: string[];
}

type PageParameters = {
    mirrors: string[],
};

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * Extracts the pages from the HTML page of the given {@link chapter}.
 * @param this - A reference to the {@link MangaScraper}
 * @param chapter - A reference to the {@link Chapter} which contains the pages
 * @param script - A script to extract the pages as \{ pics : string[], servers: string[] \}
 */
async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string = pagesWithServersScript, delay: number = 1500): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    uri.searchParams.set('mtr', '1');
    const images = await FetchWindowScript<ImagesData[]>(new Request(uri), script, delay);
    return images.map(image => new Page<PageParameters>(this, chapter, new URL(image.url), { mirrors: image.mirrors }));
}
/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A script to extract the pages as \{ pics : string[], servers: string[] \}
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script = pagesWithServersScript, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script, delay);
            }
        };
    };
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * This method fetch pages by trying different urls. Page must have "alternativeUrls: url,url, url, etc..." in Parameters.
 */
export function ImageAjax() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal);
            }
        };
    };
}

async function FetchImage(this: MangaScraper, page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        for (const uri of [page.Link, ...page.Parameters.mirrors]) {
            try {
                const request = new Request(uri, { signal: signal, headers: { Referer: this.URI.href } });
                const response = await Fetch(request);
                const blob = await response.blob();
                if (blob.type.startsWith('image/')) return blob;
            } catch { }
        }
    }, priority, signal);
}
