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
            async function fetchScriptedImages() {
                const pagecount = window.DM5_IMAGE_COUNT || window.imagecount || 0;
                const imageScripts = await Promise.all([...(new Array(pagecount)).keys()].map(page => {
                    return $.ajax({
                        url: '${endpoint}',
                        data: {
                            cid: window.DM5_CID || window.chapterid,
                            page: page + 1,
                            key: $("#dm5_key").val() || window.guidkey || '',
                            //language: 1,
                            //gtk: 6,
                            _cid: window.DM5_CID,
                            _mid: window.DM5_MID,
                            _dt: window.DM5_VIEWSIGN_DT,
                            _sign: window.DM5_VIEWSIGN
                        }
                    });
                }));
                return imageScripts.map(script => {
                    eval(script);
                    return new URL(d[0], window.location.href).href;
                });
            }
            try {
                const images = window.newImgs ? window.newImgs : await fetchScriptedImages();
                const lastImage = new Image();
                lastImage.onload = () => {
                    if(lastImage.naturalWidth === 1000 && lastImage.naturalHeight === 563) {
                        images.pop();
                    }
                    resolve(images);
                };
                lastImage.onerror = error => reject(error);
                lastImage.src = images.at(-1);
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