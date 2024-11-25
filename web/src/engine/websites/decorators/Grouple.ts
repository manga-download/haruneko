//Glouple.co russian website family : AllHentai, SelfManga, Seimanga, Usagi, ReadManga
import { Exception } from '../../Error';
import { Fetch, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import { type Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

const pagesWithServersScript = `
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

export const queryMangas = 'div.tile div.desc h3 a';
export const queryMangaTitle = 'meta[itemprop = "name"]';
export const pathMangas = '/list?offset={page}';
export const pageMangaOffset = 70;
export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]'
].join(',');

type ImagesData = {
    url: string,
    mirrors: string[]
}

type PageParameters = {
    mirrors: string[]
};

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A script to extract the pages as `{`url: string, mirrors: string[] `}`[]
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script = pagesWithServersScript, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                const images = await FetchWindowScript<ImagesData[]>(new Request(new URL(chapter.Identifier, this.URI)), script, delay);
                return images.map(image => new Page<PageParameters>(this, chapter, new URL(image.url), { mirrors: image.mirrors }));
            }
        };
    };
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * This method fetch pages by trying different urls. Parameters must have `{`mirrors: string[]`}`
 */
export function ImageAjaxWithMirrors() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchMirroredImage.call(this, page, priority, signal);
            };
        };
    };
}

async function FetchMirroredImage(this: MangaScraper, page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const cumulatedExceptionsMessages: string[]= [];
        for (const uri of [page.Link, ...page.Parameters.mirrors]) {
            try {
                const request = new Request(uri, { signal: signal, headers: { Referer: this.URI.href } });
                const response = await Fetch(request);
                const blob = await response.blob();
                if (blob.type.startsWith('image/')) return blob;
            } catch (error) {
                cumulatedExceptionsMessages.push(error.message);
            }
        }
        throw new Exception(R.Plugin_Common_Image_MirroredDownloadError, cumulatedExceptionsMessages.toString());
    }, priority, signal);
}
