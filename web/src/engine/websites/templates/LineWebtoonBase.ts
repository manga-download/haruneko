import { Tags } from '../../Tags';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';
import { Priority } from '../../taskpool/DeferredTask';
import DeScramble from '../../transformers/ImageDescrambler';
import { TaskPool } from '../../taskpool/TaskPool';
import { RateLimit } from '../../taskpool/RateLimit';

const defaultPageScript = `
    new Promise(async (resolve, reject) => {

        try {
            // Process motion webtoon
            if (document.querySelector('div#ozViewer div.oz-pages')) {
                const templateURLs = window.__motiontoonViewerState__.motiontoonParam.pathRuleParam;
                const uri = window.__motiontoonViewerState__.motiontoonParam.viewerOptions.documentURL;
                const response = await fetch(uri);
                const data = await response.json();
                for (const page of data.pages) {
                    for (const layer of page.layers) {
                        const layerAsset = layer.asset.split('/');
                        const layerAssetFile = data.assets[layerAsset[0]][layerAsset[1]];
                        const layerAssetExtension = layerAssetFile.split('.').pop();
                        if (layer.type === 'image') {
                            layer.asset = templateURLs['image'][layerAssetExtension].replace('{=filename}', layerAssetFile);
                        }
                        for (const keyframe in layer.effects) {
                            const effect = layer.effects[keyframe]['sprite'];
                            if (effect && effect.type === 'sprite') {
                                const effectAsset = effect.asset.split('/');
                                const effectAssetFile = data.assets[effectAsset[0]][effectAsset[1]];
                                const effectAssetExtension = effectAssetFile.split('.').pop();
                                effect.asset = templateURLs['image'][effectAssetExtension].replace('{=filename}', effectAssetFile);
                                for (const index in effect.collection) {
                                    const collectionAsset = effect.collection[index].split('/');
                                    const collectionAssetFile = data.assets[collectionAsset[0]][collectionAsset[1]];
                                    const collectionAssetExtension = collectionAssetFile.split('.').pop();
                                    effect.collection[index] = templateURLs['image'][collectionAssetExtension].replace('{=filename}', collectionAssetFile);
                                }
                            }
                        }
                    }
                }
                resolve(data.pages);
            } else {
            // Process hard-sub webtoon (default)
                const images = [...document.querySelectorAll('div.viewer div.viewer_lst div.viewer_img img[data-url]')];
                const links = images.map(element => new URL(element.dataset.url, window.location).href);
                resolve(links);
            }

        } catch (error) {
            reject(error);
        }
    });
`;

const mangasLanguageMap = new Map([
    ['zh', Tags.Language.Chinese],
    ['en', Tags.Language.English],
    ['fr', Tags.Language.French],
    ['de', Tags.Language.German],
    ['id', Tags.Language.Indonesian],
    ['it', Tags.Language.Italian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['es', Tags.Language.Spanish],
    ['th', Tags.Language.Thai],
    ['tr', Tags.Language.Turkish],

    ['ARA', Tags.Language.Arabic],
    //BEN, Bengali,
    //BUL, Bulgarian,
    ['CMN', Tags.Language.Chinese],
    ['CMT', Tags.Language.Chinese],
    //CES, Czech],
    //DAN, Danish],
    //NLD, Dutch],
    ['ENG', Tags.Language.English],
    //FIL, Filipino],
    ['DEU', Tags.Language.German],
    //GRE, Greek],
    //HIN, Hindi],
    ['IND', Tags.Language.Indonesian],
    ['ITA', Tags.Language.Italian],
    ['JPN', Tags.Language.Japanese],
    //LIT, Lithuanian,
    //MAY, Malay,
    //MON, Mongolian,
    //PER, Persian,
    ['POL', Tags.Language.Polish],
    ['POR', Tags.Language.Portuguese],
    ['POT', Tags.Language.Portuguese],
    //RON, Romanian,
    ['RUS', Tags.Language.Russian],
    //SWE, Swedish,
    ['THA', Tags.Language.Thai],
    ['TUR', Tags.Language.Turkish],
    //UKR, Ukrainian,
    ['VIE', Tags.Language.Vietnamese],
]);

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

function ChapterExtractor(element: HTMLAnchorElement) {
    const chapter = element.querySelector('span.tx');
    let title = chapter ? chapter.textContent.trim() + ' - ' : '';
    title += element.querySelector('span.subj span').textContent.trim();
    // extrack link from javascript:checkAgeAgreement('path');
    // But, ' can be in url as %27, its encoded form > we use decodeURIComponent to make sure the regex work
    const id = /'/.test(element.href) ? decodeURIComponent(element.href).match(/'([^']+)'/)[1] : element.pathname + element.search;
    return { id, title };
}

@Common.MangasNotSupported()
export class LineWebtoonBase extends DecoratableMangaScraper {
    protected languageRegexp = /\/([a-z]{2})\//;
    protected mangaRegexp = /[a-z]{2}\/[^/]+\/[^/]+\/list\?title_no=\d+$/;
    protected queryMangaTitleURI = 'div.info .subj';
    protected mangaLabelExtractor = Common.ElementLabelExtractor();
    protected queryChapters = 'div.detail_body div.detail_lst ul li > a';
    protected pageScript = defaultPageScript;
    private readonly interactionTaskPool = new TaskPool(1, RateLimit.PerMinute(30));

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url) && url.startsWith(this.URI.origin);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await this.interactionTaskPool.Add(async () => Common.FetchMangaCSS.call(this, provider, url, this.queryMangaTitleURI, this.mangaLabelExtractor, true, false), Priority.Normal);
        const languageCode = this.languageRegexp ? url.match(this.languageRegexp)[1]: '';
        if (mangasLanguageMap.has(languageCode)) manga.Tags.Value.concat([mangasLanguageMap[languageCode]]);
        return manga;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapterList.isMissingLastItemFrom(chapters) ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const data = await this.interactionTaskPool.Add(async () => FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}&page=${page}`, this.URI)), this.queryChapters), Priority.Normal);
        return data.map(element => {
            const { id, title } = ChapterExtractor.call(this, element);
            return new Chapter(this, manga, id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.interactionTaskPool.Add(async () => FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), this.pageScript, 1500), Priority.Normal);
        if (!Array.isArray(data)) return [];
        return typeof data[0] === 'string' ? (data as Array<string>).map(page => {
            const pageUrl = new URL(page);
            pageUrl.searchParams.delete('type');
            return new Page(this, chapter, pageUrl);
        }) : this.CreatePagesfromData(chapter, data as PageData[]);
    }

    private CreatePagesfromData(chapter: Chapter, data: PageData[]): Page<PageData>[] {
        return data.map(page => new Page<PageData>(this, chapter, new URL(this.URI), { Referer: this.URI.origin, ...page }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters?.layers) return await this.interactionTaskPool.Add(async () => Common.FetchImageAjax.call(this, page, priority, signal, true), Priority.Normal);
        const payload = page.Parameters;
        return this.imageTaskPool.Add(async () => {
            return DeScramble(new ImageData(payload.width, payload.height,), async (_, ctx) => {
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
                            AdjustTextLayerVisibility(layer, image.width, image.height, ctx.canvas.width, ctx.canvas.height);
                        }
                        // TODO: process layer.keyframes in case top/left/width/height is animated?
                        ctx.drawImage(image, layer.left, layer.top, layer.width || image.width, layer.height || image.height);
                    }
                }
            });
        }, priority, signal);
    }
}

function AdjustTextLayerVisibility(layer: ImageLayer, textLayerWidth: number, textLayerHeight: number, canvasWidth: number, canvasHeight: number) {
    if (textLayerHeight > canvasHeight) {
        layer.top = 0;
        layer.height = canvasHeight;
        layer.width = layer.width * canvasHeight / textLayerHeight;
    } else {
        if (layer.top + textLayerHeight > canvasHeight) {
            layer.top = canvasHeight - textLayerHeight;
        }
        if (layer.top < 0) {
            layer.top = 0;
        }
    }
    if (textLayerWidth > canvasWidth) {
        layer.left = 0;
        layer.width = canvasWidth;
        layer.height = layer.height * canvasWidth / textLayerWidth;
    } else {
        if (layer.left + textLayerWidth > canvasWidth) {
            layer.left = canvasWidth - textLayerWidth;
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
