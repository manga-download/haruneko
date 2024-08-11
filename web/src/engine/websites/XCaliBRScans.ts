import { Tags } from '../Tags';
import icon from './XCaliBRScans.webp';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeProxify from '../transformers/ImageLinkDeProxifier';
import DeScramble from '../transformers/ImageDescrambler';

type PageScriptResult = {
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

@MangaStream.MangaCSS(/^{origin}\/webcomics\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/webcomics/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xcalibrscans', 'xCaliBR Scans', 'https://xcalibrscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
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

        const data = await FetchWindowScript<PageScriptResult>(new Request(new URL(chapter.Identifier, this.URI)), pagescript, 2500);
        const piclist = data.imagz.map(link => DeProxify(new URL(link)).href);
        switch (data.scrambled) {

            case 0:
            case 1: //Flip each picture, no grouping
                return piclist.map(pic => {
                    return new Page(this, chapter, new URL(pic, this.URI), { scrambled: data.scrambled });
                });
            case 2: {//Flip and group by 2
                const pages = [];

                //create one Page for each 2 pictures
                for (let i = 0; i < piclist.length - 1; i += 2) {
                    const page = new Page(this, chapter, new URL(piclist[i], this.URI), { scrambled: data.scrambled, secondaryPic: piclist[i + 1] });
                    pages.push(page);
                }
                //get remaining picture if number was odd
                if (piclist.length % 2 > 0) {
                    pages.push(new Page(this, chapter, new URL(piclist.pop(), this.URI), { scrambled: 0 }));
                }
                return pages;
            }
            default:
                throw Error();
        }
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        switch (page.Parameters.scrambled) {
            case 0: {// No scrambling, return image
                return Common.FetchImageAjax.call(this, page, priority, signal);
            }
            case 1: {// Flip picture
                const blobMainImage = await Common.FetchImageAjax.call(this, page, priority, signal);
                return DeScramble(blobMainImage, async (bitmap, ctx) => {
                    ctx.scale(-1, 1);
                    ctx.drawImage(bitmap, 0, 0, -bitmap.width, bitmap.height);
                });
            }
            case 2: { // Combine + Flip 2 pictures
                const promises: Promise<Blob>[] = [];
                promises.push(this.FetchBlob(page.Link.href, priority, signal));
                promises.push(this.FetchBlob((page.Parameters.secondaryPic) as string, priority, signal));

                const [blobMainImage, blobSecondImage] = await Promise.all(promises);

                const b1 = await createImageBitmap(blobMainImage);
                const b2 = await createImageBitmap(blobSecondImage);
                return DeScramble(new ImageData(b1.width + b2.width, b1.height), async (_, ctx) => {
                    ctx.scale(-1, 1);
                    ctx.drawImage(b2, 0, 0, -b2.width, b2.height);
                    ctx.drawImage(b1, -b2.width, 0, -b1.width, b1.height);
                });
            }
        }

    }

    private async FetchBlob(url: string, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(url, {
                signal,
                headers: {
                    Referer: this.URI.href
                }
            }));
            return response.blob();
        }, priority, signal);
    }

}