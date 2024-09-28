import { FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type Manga, Chapter, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import DeScramble from '../../transformers/ImageDescrambler';
import { Tags } from '../../Tags';

export const queryChapters = 'div.detail_body div.detail_lst ul li > a';
export const queryMangaTitleURI = 'div.info .subj';

const DefaultLabelExtractor = Common.ElementLabelExtractor();
const DefaultLanguageRegexp = /\/([a-z]{2})\//;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const mangasLanguageMap = {
    zh: Tags.Language.Chinese,
    en: Tags.Language.English,
    fr: Tags.Language.French,
    de: Tags.Language.German,
    id: Tags.Language.Indonesian,
    it: Tags.Language.Italian,
    ja: Tags.Language.Japanese,
    ko: Tags.Language.Korean,
    es: Tags.Language.Spanish,
    th: Tags.Language.Thai,
    tr: Tags.Language.Turkish,

    ARA: Tags.Language.Arabic,
    //BEN: Bengali,
    //BUL: Bulgarian,
    CMN: Tags.Language.Chinese,
    CMT: Tags.Language.Chinese,
    //CES: Czech,
    //DAN: Danish,
    //NLD: Dutch,
    ENG: Tags.Language.English,
    //FIL: Filipino,
    DEU: Tags.Language.German,
    //GRE: Greek,
    //HIN: Hindi,
    IND: Tags.Language.Indonesian,
    ITA: Tags.Language.Italian,
    JPN: Tags.Language.Japanese,
    //LIT: Lithuanian,
    //MAY: Malay,
    //MON: Mongolian,
    //PER: Persian,
    POL: Tags.Language.Polish,
    POR: Tags.Language.Portuguese,
    POT: Tags.Language.Portuguese,
    //RON: Romanian,
    RUS: Tags.Language.Russian,
    //SWE: Swedish,
    THA: Tags.Language.Thai,
    TUR: Tags.Language.Turkish,
    //UKR: Ukrainian,
    VIE: Tags.Language.Vietnamese,
};

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
    new Promise(async (resolve, reject) => {

        try {
            // Process motion webtoon
            if (document.querySelector('div#ozViewer div.oz-pages')) {
                let templateURLs = window.__motiontoonViewerState__.motiontoonParam.pathRuleParam;
                let uri = window.__motiontoonViewerState__.motiontoonParam.viewerOptions.documentURL;
                let response = await fetch(uri);
                let data = await response.json();
                for (let page of data.pages) {
                    console.log('PAGE:', page.id);
                    for (let layer of page.layers) {
                        let layerAsset = layer.asset.split('/');
                        let layerAssetFile = data.assets[layerAsset[0]][layerAsset[1]];
                        let layerAssetExtension = layerAssetFile.split('.').pop();
                        if (layer.type === 'image') {
                            layer.asset = templateURLs['image'][layerAssetExtension].replace('{=filename}', layerAssetFile);
                        }
                        console.log('  LAYER:', layer.type, '=>', layer.asset);
                        for (let keyframe in layer.effects) {
                            let effect = layer.effects[keyframe]['sprite'];
                            if (effect && effect.type === 'sprite') {
                                let effectAsset = effect.asset.split('/');
                                let effectAssetFile = data.assets[effectAsset[0]][effectAsset[1]];
                                let effectAssetExtension = effectAssetFile.split('.').pop();
                                effect.asset = templateURLs['image'][effectAssetExtension].replace('{=filename}', effectAssetFile);
                                console.log('    EFFECT:', effect.type, '=>', effect.asset);
                                for (let index in effect.collection) {
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
            } else {
            // Process hard-sub webtoon (default)
                let images = [...document.querySelectorAll('div.viewer div.viewer_lst div.viewer_img img[data-url]')];
                let links = images.map(element => new URL(element.dataset.url, window.location).href);
                resolve(links);
            }

        } catch (error) {
            reject(error);
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

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname`and the `search` of the given {@link url} will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param languageRegexp - A regexp to extract language code from url pathname
 * @param extract - An Extractor to get manga infos
 * @param includeSearch - append Uri.search to the manga identifier
 * @param includeHash - append Uri.hash to the manga identifier
  */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query = queryMangaTitleURI, languageRegexp = DefaultLanguageRegexp, extract = DefaultLabelExtractor, includeSearch = true, includeHash = false): Promise<Manga> {
    const manga = await Common.FetchMangaCSS.call(this, provider, url, query, extract, includeSearch, includeHash);
    try {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const languageCode = url.match(languageRegexp)[1];
        //manga.Tags.Value.push(mangasLanguageMap[languageCode]); // TODO: fix manga language attribution ?
    } catch { }
    return manga;
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param languageRegexp - A regexp to extract language code from url pathname
 * @param extract - An Extractor to get manga infos
 * @param includeSearch - append Uri.search to the manga identifier
 * @param includeHash - append Uri.hash to the manga identifier
 */
export function MangaCSS(pattern: RegExp, query = queryMangaTitleURI, languageRegexp = DefaultLanguageRegexp, extract = DefaultLabelExtractor, includeSearch = true, includeHash = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query, languageRegexp, extract, includeSearch, includeHash);
            }
        };
    };
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
        const chapters = await GetChaptersFromPage(this, manga, query, extractor, page);
        chapters.length > 0 && !ChapterEndsWith(chapterList, chapters) ? chapterList.push(...chapters) : run = false;
    }
    return chapterList;
}

async function GetChaptersFromPage(scrapper: MangaScraper, manga: Manga, query: string, extractor, page: number): Promise<Chapter[]> {
    const url = new URL(manga.Identifier, scrapper.URI);
    url.searchParams.set('page', String(page));
    const request = new Request(url.href);
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
        Common.ThrowOnUnsupportedDecoratorContext(context);

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
    const data = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), script, 1500);
    if (!Array.isArray(data)) return [];
    return typeof data[0] === 'string' ? (data as Array<string>).map(page => new Page(this, chapter, new URL(page))) : CreatePagesfromData(this, chapter, data as PageData[]);
}

//sample for descrambling : //https://www.webtoons.com/id/horror/guidao/list?title_no=874
async function CreatePagesfromData(scraper: MangaScraper, chapter: Chapter, data: PageData[]): Promise<Page[]> {
    return data.map(page => {
        const parameters = { Referer: scraper.URI.origin, page: JSON.stringify(page) };
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
        Common.ThrowOnUnsupportedDecoratorContext(context);

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
async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false): Promise<Blob> {
    let payload: PageData = undefined;
    if (page.Parameters?.page) payload = JSON.parse(page.Parameters.page as string);

    return !payload ? await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType) : DeScramble(new ImageData(payload.width, payload.height,), async (_, ctx) => {
        ctx.canvas.width = payload.width;
        ctx.canvas.height = payload.height;

        if (payload.background.image) {
            const image = await LoadImage(payload.background.image);
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }
        if (payload.background.color) {
            ctx.fillStyle = payload.background.color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        for (const layer of payload.layers) {
            const type = layer.type.split('|');
            if (type[0] === 'image') {
                const image = await LoadImage(layer.asset);
                if (type[1] === 'text') {
                    AdjustTextLayerVisibility(layer, image, ctx.canvas);
                }
                // TODO: process layer.keyframes in case top/left/width/height is animated?
                ctx.drawImage(image, layer.left, layer.top, layer.width || image.width, layer.height || image.height);
            }
        }

    });
}

function AdjustTextLayerVisibility(layer: ImageLayer, textLayer: HTMLImageElement, canvas: OffscreenCanvas) {
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

async function LoadImage(url: string): Promise<HTMLImageElement> {
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
export function ImageAjax(detectMimeType = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType);
            }
        };
    };
}
