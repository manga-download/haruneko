import { Fetch, FetchRequest, FetchWindowScript } from '../../FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import { type Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';

const pagesWithServersScript = `
new Promise(resolve => {
    const payload = {
        pics: rm_h.pics.map(pic => rm_h.reader.preparePicUrl(pic.url)),
        servers: rm_h.servers.map(server => server.path)
    };
    resolve(payload)
});
`;

export const queryMangas = [
    'div.tile div.desc h3 a',
].join(',');

export const queryChapters = [
    'a.chapter-link.cp-l'
].join(',');

export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]',
].join(',');

export const queryMangaTitle = [
    'div#mangaBox h1.names span.name',
].join(',');

export const pathMangas = '/list?offset={page}';
export const pageMangaOffset = 70;

type scriptResult = {
    pics: string[],
    servers: string[];
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * Extracts the pages from the HTML page of the given {@link chapter}.
 * @param this - A reference to the {@link MangaScraper}
 * @param chapter - A reference to the {@link Chapter} which contains the pages
 * @param endpoint - An URL path providing the protected image link data (for each image)
 */
async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string, delay : number): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    uri.searchParams.set('mtr', '1');
    const request = new FetchRequest(uri.href);
    const images = await FetchWindowScript<scriptResult>(request, script, delay);
    return images.pics.map(url => {
        const parameters = { Referer: uri.href, servers: JSON.stringify(images.servers) };
        return new Page(this, chapter, new URL(url), parameters);
    });
}
/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
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
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageAjax(detectMimeType = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType, false);
            }
        };
    };
}

async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, pretendImageElementSource = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {

        //1st : try to get the url directly
        const request = cookImageRequest(page, signal, pretendImageElementSource);
        let response = undefined;
        let failed = false;
        try {
            response = await Fetch(request);
        } catch {
            failed = true;
        }
        //if requested failed, loop servers
        if (failed || response.status != 200) {
            const servers: string[] = JSON.parse(page.Parameters.servers as string);
            for (const server of servers) {
                if (`${page.Link.origin}/` === server) {
                    continue;
                }
                const request = cookImageRequest(page, signal, pretendImageElementSource, server);
                failed = false;
                try {
                    response = await Fetch(request);
                } catch {
                    failed = true;
                }
                if ( !failed && response.status == 200) {
                    break;
                }
            }
        }
        return detectMimeType ? Common.GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

function cookImageRequest(page: Page, signal: AbortSignal, pretendImageElementSource: boolean, customServer = ''): FetchRequest {
    const url = customServer == '' ? page.Link.href : new URL(page.Link.pathname, customServer).href;
    const request = new FetchRequest(url, {
        signal: signal,
        headers: {
            Referer: page.Parameters?.Referer || page.Link.origin,
        }
    });
    if (pretendImageElementSource) {
        request.headers.set('Accept', 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8');
        request.headers.set('Sec-Fetch-Dest', 'image');
    }
    return request;
}
