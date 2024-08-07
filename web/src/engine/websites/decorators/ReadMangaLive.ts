import { Fetch, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import { type Priority } from '../../taskpool/DeferredTask';
import * as Common from './Common';

const pagesWithServersScript = `
    new Promise(resolve => {
        resolve({
            pics: rm_h.pics.map(pic => rm_h.reader.preparePicUrl(pic.url)),
            servers: rm_h.servers.map(server => server.path)
        });
    });
`;

export const queryMangas = 'div.tile div.desc h3 a';
export const queryChapters = 'a.chapter-link.cp-l';
export const queryMangaTitle = 'div#mangaBox h1.names span.name';
export const pathMangas = '/list?offset={page}';
export const pageMangaOffset = 70;
export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]',
].join(',');

type ImagesData = {
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
 * @param script - A script to extract the pages as \{ pics : string[], servers: string[] \}
 */
async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string = pagesWithServersScript, delay: number = 0): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    uri.searchParams.set('mtr', '1');
    const images = await FetchWindowScript<ImagesData>(new Request(uri), script, delay);

    images.pics = images.pics.map(pic => pic.replace(/^\/\//, 'https://'));
    images.servers = images.servers
        .map(server => server.replace(/^\/\//, 'https://'))
        .filter((server, index) => index === images.servers.findIndex(s => s === server));

    return images.pics.map(url => {
        const imageUrl = new URL(url);
        const alternativeUrls = images.servers.map(server => new URL(imageUrl.pathname + imageUrl.search, server))
            .filter(altUrl => altUrl.href != imageUrl.href)
            .join(',');
        return new Page(this, chapter, imageUrl, {
            Referer: uri.origin,
            alternativeUrls: alternativeUrls
        });
    });
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

async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {

    return this.imageTaskPool.Add(async () => {
        const blob = await GetImage(page, signal);
        if (blob.type.startsWith('image/')) return blob;

        const alternativeUrls: string[] = (page.Parameters.alternativeUrls as string).split(',');
        for (const alternativeUrl of alternativeUrls) {
            page.Link.href = alternativeUrl;
            const blob = await GetImage(page, signal);
            if (blob.type.startsWith('image/')) return blob;
        }
    }, priority, signal);
}

async function GetImage(page: Page, signal: AbortSignal): Promise<Blob> {
    const request = new Request(page.Link, {
        signal: signal,
        headers: {
            Referer: page.Parameters?.Referer ?? page.Link.origin,
        }
    });
    const response = await Fetch(request);
    return await Common.GetTypedData(await response.arrayBuffer());
}
