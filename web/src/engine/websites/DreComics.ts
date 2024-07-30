import { Tags } from '../Tags';
import icon from './DreComics.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type PageData = {
    index: number,
    width: number,
    height: number,
    endpoint: string,
    authkey: string,
    parts?: PartData[]
    steprect: {
        x: number,
        y: number,
        width: number,
        height: number,
    },
    stepcount: number,
    scrambleArray: number[],
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

@Common.MangaCSS(/^{origin}\/drecomics\/series\/[^/]+$/, 'div.detailComics h1.detailComics_title > span')
@Common.MangasSinglePageCSS('/drecomics/series', 'div.seriesList li.seriesList__item a.seriesList__link')
@Common.ChaptersSinglePageCSS('div.ebookListItem a.ebookListItem_title')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drecomics', 'DRE Comics', 'https://drecom-media.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
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
        const width = parseInt(XML.getElementsByTagName('Width')[0].textContent);
        const height = parseInt(XML.getElementsByTagName('Height')[0].textContent);
        const scrambleWidth = parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Width').textContent);
        const scrambleHeight = parseInt(XML.getElementsByTagName('Scramble')[0].querySelector('Height').textContent);

        for (let i = 0; i < totalpages; i++) {
            const pagename = i.toString().padStart(4, '0') + '.xml';
            const url = new URL(endpoint);
            url.searchParams.set('mode', Modes.MODE_DL_PAGE_XML);
            url.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
            url.searchParams.set('vm', '4');
            url.searchParams.set('file', pagename);
            url.searchParams.set('param', authkey);

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
                stepcount: parseInt(XML.getElementsByTagName('StepCount')[0].textContent),
                scrambleArray: XML.getElementsByTagName('Scramble')[0].textContent.split(',').map(element => parseInt(element)),
                steprect: {
                    x: parseInt(XML.getElementsByTagName('StepRect')[0].querySelector('X').textContent),
                    y: parseInt(XML.getElementsByTagName('StepRect')[0].querySelector('Y').textContent),
                    width: parseInt(XML.getElementsByTagName('StepRect')[0].querySelector('Width').textContent),
                    height: parseInt(XML.getElementsByTagName('StepRect')[0].querySelector('Height').textContent)
                },
            };

            const parts = [...XML.getElementsByTagName('Kind')];
            pagedata.parts = [];
            parts.forEach(element => {
                pagedata.parts.push({
                    number: parseInt(element.getAttribute('No')),
                    scramble: element.getAttribute('scramble') === '1',
                    type: parseInt(element.textContent)
                });
            });

            pages.push(new Page(this, chapter, new URL(this.URI), { ...pagedata }));

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

                return DeScramble(new ImageData(pageData.width, pageData.height), async (_, ctx) => {

                    for (const partData of pageData.parts) {
                        switch (partData.type) {
                            case PartType.DATA_TYPE_JPEG:
                            case PartType.DATA_TYPE_GIF:
                            case PartType.DATA_TYPE_PNG:
                            case PartType.DATA_TYPE_LESIA:
                            case PartType.DATA_TYPE_LESIA_OLD: {
                                const partFileName = [pageData.index.toString().padStart(4, '0'), partData.number.toString().padStart(4, '0')].join('_') + '.bin';
                                const imageUrl = new URL(pageData.endpoint);
                                let type = partData.type;
                                type !== PartType.DATA_TYPE_LESIA && type !== PartType.DATA_TYPE_LESIA_OLD || (type = PartType.DATA_TYPE_JPEG);

                                imageUrl.searchParams.set('mode', type.toString());
                                imageUrl.searchParams.set('file', partFileName);
                                imageUrl.searchParams.set('reqtype', RequestType.REQUEST_TYPE_FILE);
                                imageUrl.searchParams.set('param', pageData.authkey);

                                const part = await LoadPart(imageUrl, partData);
                                let partCanvas = transcribeImageToCanvas(part.image);
                                let transferCanvas = document.createElement('canvas');

                                //parts.push(part);
                                if (part.image) {

                                    if (part.scramble) {

                                        const o = pageData.scramble.width,
                                            n = pageData.scramble.height;
                                        if (!(pageData.scrambleArray.length < o * n || partCanvas.width < 8 * o || partCanvas.height < 8 * n)) {
                                            let partCTX = partCanvas.getContext('2d');
                                            let transferCTX = transferCanvas.getContext('2d');
                                            transferCanvas.width = 0;
                                            transferCanvas.height = 0;
                                            transferCanvas.width = partCanvas.width;
                                            transferCanvas.height = partCanvas.height;
                                            transferCTX.drawImage(partCanvas, 0, 0); //Draw PART on Transfert

                                            let u: number,
                                                c: number,
                                                l: number,
                                                d: number,
                                                p: number,
                                                h = 8 * Math.floor(Math.floor(partCanvas.width / o) / 8),
                                                g = 8 * Math.floor(Math.floor(partCanvas.height / n) / 8);
                                            const f = pageData.scrambleArray.length;

                                            for (let b = 0; b < f; b++) {
                                                u = b % o;
                                                c = Math.floor(b / o);
                                                u *= h;
                                                c *= g;
                                                l = (p = pageData.scrambleArray[b]) % o;
                                                d = Math.floor(p / o);
                                                l *= h;
                                                d *= g;
                                                partCTX.clearRect(u, c, h, g);//
                                                partCTX.drawImage(transferCanvas, l, d, h, g, u, c, h, g); //draw TRANSFERT to part
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