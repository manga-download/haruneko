import { Tags } from '../Tags';
import icon from './MangaKimi.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchRegex, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type JSImageData = {
    url: string,
    pieces: ImagePiece[]
};

type ImageData = {
    pieces: ImagePiece[]
}

type ImagePiece = {
    destX: number,
    destY: number,
    srcX: number,
    srcY: number
}

const pageScript = `
    new Promise(resolve => {
        const nodes = [...document.querySelectorAll('div#readerarea > img, div#readerarea > div.displayImage')];
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
`;

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Common.MangasMultiPageCSS('div.bs div.bsx > a', Common.PatternLinkGenerator('/manga-list/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakimi', 'MangaKimi', 'https://www.mangakimi.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        // First, test if the chapter is normal ts_reader from mangastream
        // Using regex because script is executed on mouse move
        const [data] = await FetchRegex(new Request(chapterUrl), /["']images["']\s*:\s*([^\]]+\])/g);
        if (data) {
            const pages = JSON.parse(data) as string[];
            return pages.map(page => new Page(this, chapter, new URL(page)));
        }
        //else, chapter has scrambled pictures
        const images = await FetchWindowScript<JSImageData[]>(new Request(chapterUrl), pageScript, 2500);
        return images.map(image => new Page<ImageData>(this, chapter, new URL(image.url), { pieces: image.pieces }));
    }

    public override async FetchImage(page: Page<ImageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.pieces ? blob : DeScramble(blob, async (image, ctx) => {
            const pieces = page.Parameters.pieces;
            const pieceWidth = image.width / 2;
            const pieceHeight = image.height / 5;
            for (const { destX, destY, srcX, srcY } of pieces) {
                ctx.drawImage(image, srcX, srcY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
            }
        });
    }
}