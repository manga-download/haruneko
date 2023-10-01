import { Tags } from '../Tags';
import icon from './XCaliBRScans.webp';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { Fetch, FetchRequest, FetchWindowScript } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';

type pageScriptResult = {
    imagz: string[],
    scrambled: number
}

const pagescript = `
        new Promise((resolve, reject) => {
            let scramble_method = 0;
            if (document.querySelector('div#readerarea div.kage div.sword_box div.sword img')){
                scramble_method = 2;
            }
            else if (document.querySelector('div#readerarea div.kage img')){
                scramble_method = 1;
            };
            if(window.ts_reader && ts_reader.params.sources) {
                resolve({
                    imagz : ts_reader.params.sources.shift().images,
                    scrambled : scramble_method
                });
            }
            else {
                setTimeout(() => {
                    try {
                        const images = [...document.querySelectorAll('div#readerarea p img')];
                        const imgz = images.map(image => image.dataset['lazySrc'] || image.dataset['src'] || image.getAttribute('original') || image.src);
                        resolve({
                            imagz : imgz,
                            scrambled : scramble_method
                        });
                    }
                    catch(error) {
                        reject(error);
                    }
                },
                2500);
            }
        });
`;

@MangaStream.MangaCSS(/^https?:\/\/xcalibrscans\.com\/webcomics\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/webcomics/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xcalibrscans', 'xCaliBR Scans', 'https://xcalibrscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        //There are 3 different type of chapters scrambling
        // Nothing : https://xcalibrscans.com/the-first-ancestor-in-history-chapter-1/
        // div#readerarea p img
        // 0
        // flipped single :  https://xcalibrscans.com/the-first-ancestor-in-history-chapter-86/
        // div#readerarea div.kage img
        // 1
        // flipped and splitted : https://xcalibrscans.com/above-ten-thousand-people-chapter-175/
        // div#readerarea div.kage div.sword_box div.sword img
        // 2

        const uri = new URL(chapter.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchWindowScript<pageScriptResult>(request, pagescript,2500);
        // HACK: bypass 'i0.wp.com' image CDN to ensure original images are loaded directly from host
        const piclist = data.imagz.map(link => link.replace(/\/i\d+\.wp\.com/, '')).filter(link => !link.includes('histats.com'));
        switch (data.scrambled) {

            case 0:
            case 1: //Flip each picture, no grouping
                return piclist.map(pic => {
                    return new Page(this, chapter, new URL(pic, this.URI), { scrambled: data.scrambled });
                });
            case 2: {//Flip and group by 2
                let count = 0;
                const pages = [];

                //create one Page for each 2 pictures
                for (let i = 0; i < piclist.length - 1; i += 2) {
                    const parameters = { scrambled: data.scrambled, secondaryPic: piclist[i + 1] };
                    const page = new Page(this, chapter, new URL(piclist[i], this.URI), parameters);
                    pages.push(page);
                    count += 2;
                }
                //get remaining picture if number was odd
                if (count < piclist.length) {
                    pages.push(new Page(this, chapter, new URL(piclist[count], this.URI), { scrambled: 0 }));
                }
                return pages;
            }
            default:
        }
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blobMainImage = await Common.FetchImage.call(this, page, priority, signal);
        const bitmaps: ImageBitmap[] = [];

        switch (page.Parameters.scrambled) {
            case 0: return blobMainImage; //No scrambling, return image
            case 1: //Flip picture
                bitmaps.push(await createImageBitmap(blobMainImage));
                return await this.composePuzzle(bitmaps, page.Parameters.scrambled);
            case 2://Combine/Flip 2 pictures
            {
                bitmaps.push(await createImageBitmap(blobMainImage));
                //fetch second image
                const pageUrl = (page.Parameters.secondaryPic) as string;
                const request = new FetchRequest(pageUrl, { referrer: this.URI.href });
                const response = await Fetch(request);
                const data = await response.blob();
                bitmaps.push(await createImageBitmap(data));
                return await this.composePuzzle(bitmaps, page.Parameters.scrambled);
            }
            default :
        }

    }
    async composePuzzle(bitmaps: ImageBitmap[], scrambleMode : number): Promise<Blob> {
        switch (scrambleMode) {
            case 1: //flip the only picture
                return new Promise(resolve => {
                    const canvas = document.createElement('canvas');
                    canvas.width = bitmaps[0].width;
                    canvas.height = bitmaps[0].height;
                    const ctx = canvas.getContext('2d');
                    ctx.scale(-1, 1);
                    ctx.drawImage(bitmaps[0], 0, 0, -bitmaps[0].width, bitmaps[0].height);
                    canvas.toBlob(data => {
                        resolve(data);
                    }, 'image/png', parseFloat('90') / 100);
                });
            case 2: //flip and combine 2 pictures
                return new Promise(resolve => {
                    const canvas = document.createElement('canvas');
                    const b1 = bitmaps[0];
                    const b2 = bitmaps[1];
                    canvas.width = b1.width + b2.width;
                    canvas.height = b1.height;
                    const ctx = canvas.getContext('2d');
                    ctx.scale(-1, 1);
                    ctx.drawImage(b2, 0, 0, -b2.width, b2.height);
                    ctx.drawImage(b1, -b2.width, 0, -b1.width, b1.height);
                    canvas.toBlob(data => {
                        resolve(data);
                    }, 'image/png', parseFloat('90') / 100);
                });
        }
    }
}