import { Tags } from '../Tags';
import icon from './ComicFesta.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type PageData = {
    //index: number,
    width: number,
    height: number,
    //endpoint: string,
    //authkey: string,
    //parts?: PartData[]
    //scrambleArray: number[],
    scramble: {
        width: number,
        height: number
    }
}

type PartData = {
    number: number,
    scramble: boolean,
    type: PartType
}

type ImagePart = {
    binaryArray?: Uint8Array,
    image?: HTMLImageElement,
    scramble: boolean
}

enum PartType {
    DATA_TYPE_LESIA = 10,
    DATA_TYPE_LESIA_OLD = 7,
    DATA_TYPE_JPEG = 1,
    DATA_TYPE_GIF = 2,
    DATA_TYPE_PNG = 3,

};
enum Modes {
    MODE_DL_XML = '0',
    MODE_DL_JPEG = '1',
    MODE_DL_GIF = '2',
    MODE_DL_PNG = '3',
    MODE_DL_FACE_XML = '7',
    MODE_DL_PAGE_XML = '8'
}

enum RequestType {
    REQUEST_TYPE_FILE = '0',
}

@Common.MangaCSS(/^{origin}\/titles\/\d+\/volumes$/, 'div#cts-title-wrap h2', Common.ElementLabelExtractor('span'))
//@Common.MangasMultiPageCSS('/ebook/comics?page={page}', 'li.seriesList_item a.seriesList_itemTitle')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicfesta', 'コミックフェスタ | ComicFesta', 'https://comic.iowl.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('paginate', 'true');
        const chapters = await FetchCSS(new Request(url), 'div.table-box');
        return chapters.map(chapter => new Chapter(this, manga, chapter.querySelector<HTMLAnchorElement>('ul.com-link li a').pathname, chapter.querySelector('th').textContent.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        const pages: Page[] = [];
        const metadatas = new Map<string, string>();
        (await FetchCSS<HTMLInputElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div#meta input')).forEach(element => metadatas.set(element.name, element.value));

        const authkey = metadatas.get('param');
        const endpoint = metadatas.get('cgi');

        const url = new URL(endpoint, this.URI);
        url.searchParams.set('mode', Modes.MODE_DL_FACE_XML);
        url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
        url.searchParams.set('vm', '4');
        url.searchParams.set('file', 'face.xml');
        url.searchParams.set('param', authkey);

        const XML = await this.FetchXML(new Request(url));
        const totalpages = parseInt(XML.getElementsByTagName('TotalPage')[0].textContent);

        const pagedata: PageData = {
            width: parseInt(XML.getElementsByTagName('Width')[0].textContent),
            height: parseInt(XML.getElementsByTagName('Height')[0].textContent),
            scramble: {
                width: parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Width').textContent),
                height: parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Height').textContent)
            },
        };

        for (let i = 0; i < totalpages; i++) {
            const pagename = i.toString().padStart(4, '0') + '.xml';
            const url = new URL(endpoint, this.URI);
            url.searchParams.set('mode', Modes.MODE_DL_PAGE_XML);
            url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
            url.searchParams.set('vm', '4');
            url.searchParams.set('file', pagename);
            url.searchParams.set('param', authkey);

            /*
            const XML = await this.FetchXML(new Request(url));
            const pagedata: PageData = {
                index: i,
                authkey: authkey,
                width: width,
                height: height,
                scramble: {
                    width: scrambleWidth,
                    height: scrambleHeight
                },
                endpoint: endpoint,
                scrambleArray: XML.getElementsByTagName('Scramble')[0].textContent.split(',').map(element => parseInt(element)),
            };

            const parts = [...XML.getElementsByTagName('Kind')];
            pagedata.parts = [];
            parts.forEach(element => {
                pagedata.parts.push({
                    number: parseInt(element.getAttribute('No')),
                    scramble: element.getAttribute('scramble') === '1',
                    type: parseInt(element.textContent)
                });
            });*/

            pages.push(new Page(this, chapter, new URL(url), { ...pagedata }));

        }

        return pages;
    }

    private async FetchXML(request: Request): Promise<XMLDocument> {
        const response = await Fetch(request);
        const data = await response.text();
        return new DOMParser().parseFromString(data, 'text/xml');
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            try {

                const pageData = page.Parameters as PageData;

                //fetch Page XML
                const XML = await this.FetchXML(new Request(page.Link));
                const pageIndex = parseInt(XML.getElementsByTagName('PageNo')[0].textContent);
                const endpoint = page.Link.origin + page.Link.pathname;
                const authkey = page.Link.searchParams.get('param');
                const scrambleArray = XML.getElementsByTagName('Scramble')[0].textContent.split(',').map(element => parseInt(element));
                const parts: PartData[] = [...XML.getElementsByTagName('Kind')].map(element => {
                    return {
                        number: parseInt(element.getAttribute('No')),
                        scramble: element.getAttribute('scramble') === '1',
                        type: parseInt(element.textContent)
                    };
                });

                return DeScramble(new ImageData(pageData.width, pageData.height), async (_, ctx) => {

                    for (const partData of parts) {
                        switch (partData.type) {
                            case PartType.DATA_TYPE_JPEG:
                            case PartType.DATA_TYPE_GIF:
                            case PartType.DATA_TYPE_PNG:
                            case PartType.DATA_TYPE_LESIA:
                            case PartType.DATA_TYPE_LESIA_OLD: {
                                const partFileName = [pageIndex.toString().padStart(4, '0'), partData.number.toString().padStart(4, '0')].join('_') + '.bin';
                                const imageUrl = new URL(endpoint);
                                let type = partData.type;
                                type !== PartType.DATA_TYPE_LESIA && type !== PartType.DATA_TYPE_LESIA_OLD || (type = PartType.DATA_TYPE_JPEG);

                                imageUrl.searchParams.set('mode', type.toString());
                                imageUrl.searchParams.set('file', partFileName);
                                imageUrl.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
                                imageUrl.searchParams.set('param', authkey);

                                const part = await LoadPart(imageUrl, partData);
                                let partCanvas = transcribeImageToCanvas(part.image);
                                let transferCanvas = document.createElement('canvas');

                                if (part.image) {

                                    if (part.scramble) {

                                        const numCols = pageData.scramble.width;
                                        const numRow = pageData.scramble.height;
                                        if (!(scrambleArray.length < numCols * numRow || partCanvas.width < 8 * numCols || partCanvas.height < 8 * numRow)) {
                                            let partCTX = partCanvas.getContext('2d');
                                            let transferCTX = transferCanvas.getContext('2d');
                                            transferCanvas.width = 0;
                                            transferCanvas.height = 0;
                                            transferCanvas.width = partCanvas.width;
                                            transferCanvas.height = partCanvas.height;
                                            transferCTX.drawImage(partCanvas, 0, 0); //Draw PART on Transfert

                                            let pieceX: number,
                                                pieceY: number,
                                                sourceX: number,
                                                sourceY: number,
                                                p: number,
                                                pieceWidth = 8 * Math.floor(Math.floor(partCanvas.width / numCols) / 8),
                                                pieceHeight = 8 * Math.floor(Math.floor(partCanvas.height / numRow) / 8);

                                            for (let scrambleIndex = 0; scrambleIndex < scrambleArray.length; scrambleIndex++) {
                                                pieceX = scrambleIndex % numCols;
                                                pieceY = Math.floor(scrambleIndex / numCols);
                                                pieceX *= pieceWidth;
                                                pieceY *= pieceHeight;
                                                sourceX = (p = scrambleArray[scrambleIndex]) % numCols;
                                                sourceY = Math.floor(p / numCols);
                                                sourceX *= pieceWidth;
                                                sourceY *= pieceHeight;
                                                partCTX.clearRect(pieceX, pieceY, pieceWidth, pieceHeight);//
                                                partCTX.drawImage(transferCanvas, sourceX, sourceY, pieceWidth, pieceHeight, pieceX, pieceY, pieceWidth, pieceHeight); //draw TRANSFERT to part
                                            }

                                            transferCTX.clearRect(0, 0, transferCanvas.width, transferCanvas.height);
                                            transferCanvas.width = 0;
                                            transferCanvas.height = 0;
                                            transferCTX = null;
                                            transferCanvas = null;

                                            ctx.drawImage(partCTX.canvas, 0, 0);
                                            partCanvas = null;
                                            partCTX = null;

                                        }

                                    }
                                }
                                break;
                            }
                        }
                    }

                });
            } catch (error) {

            }
        }, priority, signal);
    }

}

async function LoadImage(url: URL): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const uri = new URL(url);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = uri.href;
    });
}

async function LoadPart(imageUrl: URL, partData: PartData): Promise<ImagePart> {
    if (partData.type === PartType.DATA_TYPE_LESIA || partData.type === PartType.DATA_TYPE_LESIA_OLD) {
        //return { binaryArray = await  }
    } else {
        return { image: await LoadImage(imageUrl), scramble: partData.scramble };
    }
}

function transcribeImageToCanvas(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.createPattern(image, 'no-repeat');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    return canvas;
}