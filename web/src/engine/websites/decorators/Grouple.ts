// Grouple.co russian website family
import { Fetch, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import { type Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';

type MirroredPage = Page<{
    mirrors: string[];
}>;

export const queryMangas = 'div.tile div.desc h3 a';
export const queryMangaTitle = 'meta[itemprop = "name"]';
export const pathMangas = '/list?offset={page}';
export const pageMangaOffset = 50;
export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]'
].join(',');

export const chapterScript = `
    new Promise(resolve => {
        resolve([...document.querySelectorAll('a.chapter-link.cp-l')].map(chapter => {
            const chapterUrl = new URL(chapter.pathname + chapter.search, window.location.origin);
            chapterUrl.searchParams.set('mtr', '1');

            for (const bloat of chapter.querySelectorAll('sup')) {
                if (bloat.parentElement) bloat.parentElement.removeChild(bloat);
            };

            return {
                id: chapterUrl.pathname + chapterUrl.search,
                title: chapter.text.trim(),
            };
        }));
    });
`;

const pageScript = `
    new Promise(resolve => {
        const servers =  rm_h.servers.map(server => server.path.replace(/^\\/\\//, 'https://'));
        const mainserver = servers.shift();
        resolve( rm_h.pics.map(pic => {
            const picUrl = new URL(rm_h.reader.preparePicUrl(pic.url).replace(/^\\/\\//, 'https://'));
            const mirrors = servers.map(server => new URL(picUrl.pathname + picUrl.search, server).href);
            return { url : new URL(picUrl.pathname + picUrl.search, mainserver).href, mirrors };
        }));
    });
`;

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A script to extract the pages as `{`url: string, mirrors: string[] `}`[]
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script = pageScript, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<MirroredPage[]> {
                const request = new Request(new URL(chapter.Identifier, this.URI));
                const images = await FetchWindowScript<{ url: string, mirrors: string[]; }[]>(request, script, delay);
                return images.map(({ url, mirrors }) => new Page(this, chapter, new URL(url), { Referer: request.url, mirrors }));
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

async function FetchImageWithMirrors(this: MangaScraper, page: MirroredPage, priority: Priority, signal: AbortSignal): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const errors: Error[] = [];
        for (const uri of [ page.Link, ...page.Parameters.mirrors ]) {
            //if (signal.aborted) throw new DOMException(undefined, 'AbortError');
            try {
                const response = await Fetch(new Request(uri, { signal: signal, headers: { Referer: page.Parameters.Referer } }));
                const blob = await response.blob();
                if (!blob.type.startsWith('image/')) throw new TypeError(blob.type);
                return blob;
            } catch (error) {
                errors.push(error);
            }
        }
        throw new AggregateError(errors);
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 */
export function ImageWithMirrors() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: MirroredPage, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageWithMirrors.call(this, page, priority, signal);
            };
        };
    };
}