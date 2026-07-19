import { Tags } from '../Tags';
import icon from './MangaIsekaiThai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import type { JSImageData, ImageData } from './MangaKimi';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageAJAXv2()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaisekaithai', 'MangaIsekaiThai', 'https://www.mangaisekaithai.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator, Tags.Language.Thai);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<JSImageData[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                const nodes = [...document.querySelectorAll('div.reading-content div.text-center > img, div.reading-content div.text-center div.displayImage')];
                const images = nodes.map(node => {
                    if (node instanceof HTMLImageElement) return {
                        url: node.src
                    };
                    eval(node.nextElementSibling.text);
                    const image = node.querySelector('img').src;
                    const pieces = sovleImage.map(piece => {
                        return {
                            destX: parseFloat(piece[0]),
                            destY: parseFloat(piece[1]),
                            srcX: parseFloat(piece[2]),
                            srcY: parseFloat(piece[3]),
                        }
                    });
                    return {
                        url: image,
                        pieces
                    };
                });
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