import { Tags } from '../Tags';
import icon from './LineWebtoon.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

const defaultPageScript = `
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
`; const mangasLanguageMap = {
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
export default class extends DecoratableMangaScraper {
    protected languageRegexp = /\/([a-z]{2})\//;
    protected mangaRegexp = /[a-z]{2}\/[^/]+\/[^/]+\/list\?title_no=\d+$/;
    protected queryMangaTitleURI = 'div.info .subj';
    protected mangaLabelExtractor = Common.ElementLabelExtractor();
    protected queryChapters = 'div.detail_body div.detail_lst ul li > a';
    protected pageScript = defaultPageScript;

    public constructor(id = 'linewebtoon', label = 'Line Webtoon', url = 'https://www.webtoons.com', tags = [Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await Common.FetchMangaCSS.call(this, provider, url, this.queryMangaTitleURI, this.mangaLabelExtractor, true, false);
        try {
            const languageCode = url.match(this.languageRegexp)[1];
            manga.Tags.Value.concat([mangasLanguageMap[languageCode]]);
        } catch { }
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
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}&page=${page}`, this.URI)), this.queryChapters);
        return data.map(element => {
            const { id, title } = ChapterExtractor.call(this, element);
            return new Chapter(this, manga, id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), this.pageScript, 1500);
        if (!Array.isArray(data)) return [];
        return typeof data[0] === 'string' ? (data as Array<string>).map(page => new Page(this, chapter, new URL(page))) : this.CreatePagesfromData(chapter, data as PageData[]);
    }

    private CreatePagesfromData(chapter: Chapter, data: PageData[]): Page<PageData>[] {
        return data.map(page => new Page<PageData>(this, chapter, new URL(this.URI), { Referer: this.URI.origin, ...page }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters?.width) return await Common.FetchImageAjax.call(this, page, priority, signal, true);
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
                            AdjustTextLayerVisibility(layer, image, ctx.canvas);
                        }
                        // TODO: process layer.keyframes in case top/left/width/height is animated?
                        ctx.drawImage(image, layer.left, layer.top, layer.width || image.width, layer.height || image.height);
                    }
                }
            });
        }, priority, signal);
    }
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
