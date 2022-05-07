// DM5, MangaFox, MangaHere

import { FetchRequest, FetchWindowScript } from '../../FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import type * as Common from './Common';

const pathname = 'chapterfun.ashx';

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * Extracts the pages from the HTML page of the given {@link chapter}.
 * @param this A reference to the {@link MangaScraper}
 * @param chapter A reference to the {@link Chapter} which contains the pages
 * @param endpoint An URL path providing the protected image link data (for each image)
 */
export async function FetchPagesSinglePageScript(this: MangaScraper, chapter: Chapter, endpoint = pathname): Promise<Page[]> {
    const script = `
        new Promise(async (resolve, reject) => {
            try {
                const images = isbarchpater ? newImgs : await Promise.all([...(new Array(imagecount)).keys()].map(async p => {
                    eval(await $.ajax({
                        url: '${endpoint}',
                        data: { cid: chapterid, page: p + 1, key: guidkey }
                    }));
                    return d[0];
                }));
                const lastIMG = new Image();
                lastIMG.onload = () => {
                    if(lastIMG.naturalWidth === 1000 && lastIMG.naturalHeight === 563) {
                        images.pop();
                    }
                    resolve(images.map(link => new URL(link, window.location.href).href));
                };
                lastIMG.onerror = error => reject(error);
                lastIMG.src = images.slice(-1).pop();
            } catch(error) {
                reject(error);
            }
        });
    `;
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const images = await FetchWindowScript<string[]>(request, script, 1000);
    return images.map(url => new Page(this, chapter, new URL(url), { Referer: uri.href }));
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchPages} method with {@link FetchPagesSinglePageScript}.
 * @param endpoint An URL path providing the protected image link data (for each image)
 */
export function PagesSinglePageScript(endpoint = pathname) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageScript.call(this, chapter, endpoint);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/