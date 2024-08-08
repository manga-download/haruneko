//Portuguese? template using JSZIP to extract chapter pages from zip files

import JSZip from 'jszip';
import { Fetch, FetchWindowPreloadScript } from '../../platform/FetchProvider';
import { Page, type Chapter, type MangaScraper } from '../../providers/MangaPlugin';
import * as Common from './Common';
import type { Priority } from '../../taskpool/DeferredTask';

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.info__capitulo__obras span.numero__capitulo').textContent.trim();
    return { id, title };
}

export const queryMangaTitleFromURI = 'h1.desc__titulo__comic';
export const mangaPath = '/todas-as-obras/';
export const queryMangas = 'div.comics__all__box a.titulo__comic__allcomics';
export const queryChapters = 'ul.capitulos__lista a.link__capitulos';

const pagescript = `
    new Promise( resolve => resolve ( urls ?? [...document.querySelectorAll('div#imageContainer img')].map(image=> new URL(image.src, window.location.origin).href)));
`;

const BypassAntiAdBlockScript = `
    fetch = new Proxy(fetch, {
        apply: (funcNative, funcThis, funcArgs) => {
            if(funcArgs.length > 0) {
                if (funcArgs[0]?.toString().includes('adskeeper') || funcArgs[0]?.toString().includes('/ads_block.txt')) {
                    funcArgs[0] = window.location.href;
                }
            }
            return Reflect.apply(funcNative, funcThis, funcArgs);
        }
    });
`;

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} from zip files (like the website)
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param script - script used to extract pages url
 * @param prescript - script to execute before everything to bypass anti adblockers
 */
async function FetchPagesPagesFromZips(this: MangaScraper, chapter: Chapter, script: string = pagescript, preScript: string = BypassAntiAdBlockScript): Promise<Page[]> {
    let request = new Request(new URL(chapter.Identifier, this.URI));
    const files: string[] = await FetchWindowPreloadScript(request, preScript, script, 2500);
    if (files.length == 0) return [];

    if (files[0].endsWith('.zip')) {
        const pages: Page[] = [];
        for (const zipurl of files) {
            request = new Request(new URL(zipurl, this.URI), { headers: { Referer: this.URI.href } });
            const response = await Fetch(request);
            const zipdata = await response.arrayBuffer();
            const zipfile = await JSZip.loadAsync(zipdata);
            const fileNames = Object.keys(zipfile.files).sort((a, b) => extractNumber(a) - extractNumber(b)).filter(fileName => !fileName.match(/\.(s)$/i));
            pages.push(...fileNames.map(fileName => new Page(this, chapter, new URL(zipurl, this.URI), { filename: fileName })));
        }
        return pages;

    } else { //we have normal pictures links
        return files.map(file => new Page(this, chapter, new URL(file)));
    }
}

function extractNumber(fileName): number {
    return parseInt(fileName.split(".")[0]);
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 * @param script - script used to extract pages url
 * @param prescript - script to execute before everything to bypass anti adblockers
 */
export function PagesFromZips(script: string = pagescript, preScript: string = BypassAntiAdBlockScript) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesPagesFromZips.call(this, chapter, script, preScript);
            }
        };
    };
}

/***********************************************
******** Image Data Extraction Methods ********
***********************************************/

/**
 * An extension method to get the image data for the given {@link page}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    return !page.Link.href.endsWith('.zip') ? await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType) :
        await this.imageTaskPool.Add(async () => {
            const request = new Request(new URL(page.Link, this.URI), {
                signal,
                headers: {
                    Referer: this.URI.href
                }
            });
            const response = await Fetch(request);
            const zipdata = await response.arrayBuffer();
            const zipfile = await JSZip.loadAsync(zipdata);
            const zipEntry = zipfile.files[page.Parameters['filename'] as string];
            const imagebuffer = await zipEntry.async('nodebuffer');
            return Common.GetTypedData(imagebuffer);
        }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageFromZip(detectMimeType: boolean = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}