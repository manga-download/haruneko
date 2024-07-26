// DM5, MangaFox, MangaHere

import { FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

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
 * @param this - A reference to the {@link MangaScraper}
 * @param chapter - A reference to the {@link Chapter} which contains the pages
 * @param endpoint - An URL path providing the protected image link data (for each image)
 */
export async function FetchPagesSinglePageScript(this: MangaScraper, chapter: Chapter, endpoint = pathname): Promise<Page[]> {
    const script = `
        new Promise(async (resolve, reject) => {
            try {
                const pagecount = window.DM5_IMAGE_COUNT || window.imagecount || 0;
                const images = window.newImgs ? window.newImgs : await Promise.all([...(new Array(pagecount)).keys()].map(async p => {
                    eval(await $.ajax({
                        url: '${endpoint}',
                        data: {
                            cid: window.DM5_CID || window.chapterid,
                            page: p + 1,
                            key: $("#dm5_key").val() || window.guidkey || '',
                            //language: 1,
                            //gtk: 6,
                            _cid: window.DM5_CID,
                            _mid: window.DM5_MID,
                            _dt: window.DM5_VIEWSIGN_DT,
                            _sign: window.DM5_VIEWSIGN
                        }
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
    const images = await FetchWindowScript<string[]>(new Request(uri), script, 1000);
    return images.map(url => new Page(this, chapter, new URL(url), { Referer: uri.href }));
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchPages} method with {@link FetchPagesSinglePageScript}.
 * @param endpoint - An URL path providing the protected image link data (for each image)
 */
export function PagesSinglePageScript(endpoint = pathname) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
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