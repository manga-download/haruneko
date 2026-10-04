import { Tags } from '../Tags';
import icon from './NiceOppai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { JSImageData, ImageData } from './MangaKimi';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'nav.crumbs span:last-of-type')
@Common.MangasMultiPageCSS('a.fcard__title', Common.PatternLinkGenerator('/manga_list/all/any/last-updated/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div#chRows a.chrow', Common.PatternLinkGenerator('{id}chapter-list/{page}/'), 0, anchor => (
    {
        title: anchor.dataset.ch.trim() != anchor.querySelector('.chrow__t')?.textContent.trim()
            ? [anchor.dataset.ch, anchor.querySelector('.chrow__t')?.textContent].joinTitleSegments()
            : anchor.dataset.ch.trim(),
        id: anchor.pathname
    }
))

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niceoppai', 'NiceOppai', 'https://www.niceoppai.net', Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<JSImageData[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                const ScrambledImages = [];
                const solver= window[Object.keys(window).find(key => window[key]?.render &&  window[key]?.q)];
                if (solver){
                    solver.q = function (imageKey, data) {
                        ScrambledImages.push({ id: imageKey, data})
                    };
                }

                const nodes = [...document.querySelectorAll('div#image-container center img, div#image-container center div[id^="image"]')];
                const images = nodes.map(node => {
                    if (node instanceof HTMLImageElement) return {
                        url: node.src
                    };
                    eval(node.nextElementSibling.text);
                    return {id: node.id };
                });

                for (let index = 0; index < images.length; index++) {
                    const image = images[index];
                    if (image.url) continue;
                    const imagesData = ScrambledImages.find(imagedata => image.id === imagedata.id).data;
                    const { u: url, map: piecesData } = imagesData;
                    image.url = url;
                    image.pieces = piecesData.map( piece => {
						return {
                            destX: parseFloat(piece[0]),
                            destY: parseFloat(piece[1]),
                            srcX: parseFloat(piece[2]),
                            srcY: parseFloat(piece[3]),
                        }
                    });
                    images[index] = image;
                }
                resolve(images);
            });

        `, 2500);
        return images.map(({ url, pieces }) => new Page<ImageData>(this, chapter, new URL(url), { pieces }));
    }

    public override async FetchImage(page: Page<ImageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.pieces ? blob : DeScramble(blob, async (image, ctx) => {
            const pieceWidth = image.width / 2;
            const pieceHeight = image.height / 5;
            for (const { destX, destY, srcX, srcY } of page.Parameters.pieces) {
                ctx.drawImage(image, srcX, srcY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
            }
        });
    }

}