import { FetchRequest, FetchCSS, FetchWindowScript } from '../../FetchProvider';
import { type MangaScraper, type Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';

export const queryChapters = 'div.detail_body div.detail_lst ul li > a';
export const queryMangaTitleURI = 'div.info .subj';

type PageData = {
    width: number,
    height: number,
    layers: ImageLayer[],
    background: {
        image: string,
        color: string
    }
}

type ImageLayer = {
    type: string,
    asset: string,
    width: number,
    height: number,
    left: number,
    top: number
}

const pageScript = `
               new Promise(async resolve => {

                    // Process motion webtoon
                    if(document.querySelector('div#ozViewer div.oz-pages')) {
                        let templateURLs = window.__motiontoonViewerState__.motiontoonParam.pathRuleParam;
                        let uri = window.__motiontoonViewerState__.motiontoonParam.viewerOptions.documentURL;
                        let response = await fetch(uri);
                        let data = await response.json();
                        for(let page of data.pages) {
                            console.log('PAGE:', page.id);
                            for(let layer of page.layers) {
                                let layerAsset = layer.asset.split('/');
                                let layerAssetFile = data.assets[layerAsset[0]][layerAsset[1]];
                                let layerAssetExtension = layerAssetFile.split('.').pop();
                                if(layer.type === 'image') {
                                    layer.asset = templateURLs['image'][layerAssetExtension].replace('{=filename}', layerAssetFile);
                                }
                                console.log('  LAYER:', layer.type, '=>', layer.asset);
                                for(let keyframe in layer.effects) {
                                    let effect = layer.effects[keyframe]['sprite'];
                                    if(effect && effect.type === 'sprite') {
                                        let effectAsset = effect.asset.split('/');
                                        let effectAssetFile = data.assets[effectAsset[0]][effectAsset[1]];
                                        let effectAssetExtension = effectAssetFile.split('.').pop();
                                        effect.asset = templateURLs['image'][effectAssetExtension].replace('{=filename}', effectAssetFile);
                                        console.log('    EFFECT:', effect.type, '=>', effect.asset);
                                        for(let index in effect.collection) {
                                            let collectionAsset = effect.collection[index].split('/');
                                            let collectionAssetFile = data.assets[collectionAsset[0]][collectionAsset[1]];
                                            let collectionAssetExtension = collectionAssetFile.split('.').pop();
                                            effect.collection[index] = templateURLs['image'][collectionAssetExtension].replace('{=filename}', collectionAssetFile);
                                            console.log('      COLLECTION:', index, '=>', effect.collection[index]);
                                        }
                                    }
                                }
                            }
                        }
                        resolve(data.pages);
                        return;
                    }

                    // Process hard-sub webtoon (default)
                    {
                        let images = [...document.querySelectorAll('div.viewer div.viewer_lst div.viewer_img img[data-url]')];
                        let links = images.map(element => new URL(element.dataset.url, window.location).href);
                        resolve(links);
                    }
                });
`;

function ChapterExtractor(element: HTMLAnchorElement) {
    const chapter = element.querySelector('span.tx');
    let title = chapter ? chapter.textContent.trim() + ' - ' : '';
    title += element.querySelector('span.subj span').textContent.trim();
    // extrack link from javascript:checkAgeAgreement('path');
    // But, ' can be in url as %27, its encoded form > we use decodeURIComponent to make sure the regex work
    const id = /'/.test(element.href) ? decodeURIComponent(element.href).match(/'([^']+)'/)[1] : element.pathname + element.search;
    return {id, title};
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 */
export async function FetchChaptersMultiPageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const chapterList = [];
    for (let page = 1, run = true; run; page++) {
        const chapters = await getChaptersFromPage(this, manga, query, extractor, page);
        chapters.length > 0 && !ChapterEndsWith(chapterList, chapters) ? chapterList.push(...chapters) : run = false;
    }
    return chapterList;
}

async function getChaptersFromPage(scrapper: MangaScraper, manga: Manga, query: string, extractor, page: number): Promise<Chapter[]> {
    const url = new URL(manga.Identifier, scrapper.URI);
    url.searchParams.set('page', String(page));
    const request = new FetchRequest(url.href);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const { id, title } = extractor.call(scrapper, element);
        return new Chapter(scrapper, manga, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 */
export function ChaptersMultiPageCSS(query: string = queryChapters, extractor = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersMultiPageCSS.call(this, manga, query, extractor);
            }
        };
    };
}

function ChapterEndsWith(target: Chapter[], source: Chapter[]) {
    if (target.length < source.length) {
        return false;
    }
    return target[target.length - 1].Identifier === source[source.length - 1].Identifier;
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 */
async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string): Promise<Page[]> {
    const url = new URL(chapter.Identifier, this.URI);
    const request = new FetchRequest(url.href);
    const data = await FetchWindowScript(request, script, 1500);
    if (!Array.isArray(data)) return [];
    return typeof data[0] == 'string' ? (data as Array<string>).map(page => new Page(this, chapter, new URL(page))) : createPagesfromData(this, chapter, data as PageData[]);
}

//sample for descrambling : //https://www.webtoons.com/id/horror/guidao/list?title_no=874&page=1
async function createPagesfromData(scraper: MangaScraper, chapter: Chapter, data: PageData[]): Promise<Page[]> {
    return data.map(page => {
        const parameters = { Referer: scraper.URI.href, page: JSON.stringify(page) };
        return new Page(scraper, chapter, new URL(scraper.URI), parameters);
    });

}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageJS(script = pageScript) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script);
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
async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, pretendImageElementSource = false): Promise<Blob> {
    return !page.Parameters ? await Common.FetchImage.call(this, page, priority, signal, detectMimeType, pretendImageElementSource) : await descrambleImage(page);
}
async function descrambleImage(page: Page): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const payload: PageData = JSON.parse(page.Parameters.page as string);
    canvas.width = payload.width;
    canvas.height = payload.height;
    const ctx = canvas.getContext('2d');
    if (payload.background.image) {
        const image = await _loadImage(payload.background.image);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
    }
    if (payload.background.color) {
        ctx.fillStyle = payload.background.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    for (const layer of payload.layers) {
        const type = layer.type.split('|');
        if (type[0] === 'image') {
            const image = await _loadImage(layer.asset);
            if (type[1] === 'text') {
                _adjustTextLayerVisibility(layer, image, canvas);
            }
            // TODO: process layer.keyframes in case top/left/width/height is animated?
            ctx.drawImage(image, layer.left, layer.top, layer.width || image.width, layer.height || image.height);
        }
    }
    return await new Promise(resolve => {
        canvas.toBlob(data => resolve(data), 'image/png', 0.90);
    });
}

function _adjustTextLayerVisibility(layer: ImageLayer, textLayer: HTMLImageElement, canvas: HTMLCanvasElement) {
    if (textLayer.height > canvas.height) {
        layer.top = 0;
        layer.height = canvas.height;
        layer.width = layer.width * canvas.height / textLayer.height;
    } else {
        if (layer.top + textLayer.height > canvas.height) {
            layer.top = canvas.height - textLayer.height;
        }
        if (layer.top < 0) {
            layer.top = 0;
        }
    }
    if (textLayer.width > canvas.width) {
        layer.left = 0;
        layer.width = canvas.width;
        layer.height = layer.height * canvas.width / textLayer.width;
    } else {
        if (layer.left + textLayer.width > canvas.width) {
            layer.left = canvas.width - textLayer.width;
        }
        if (layer.left < 0) {
            layer.left = 0;
        }
    }
}

async function _loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const uri = new URL(url);
        uri.searchParams.delete('type');
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = uri.href;
    });
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageDescrambler(detectMimeType = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType, false);
            }
        };
    };
}
