import { Tags } from '../Tags';
import icon from './SpoilerPlus.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/DeferredTask';
import * as Common from './decorators/Common';
import { XOR } from '../Crypto';
import { GetBytesFromHex, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

type ChapterCryptedData = {
    c: string; //SCRAMBLEDATA
    d: string; //CDN
    e: string[]; //Array of pathnames to append to CDN
};

type PageData = {
    ScrambleArray: number[];
};

type TDimension = {
    height: number;
    width: number;
};

type TPiece = {
    height: number;
    left: number;
    top: number;
    width: number;
};

type TPuzzleData = {
    from: TPiece;
    to: TPiece;
};

function CleanupTitle(text: string): string {
    return text.trim().replace(/Raw Free/i, '').trim();
}

export function MangaLinkExtractor<T extends HTMLElement>(element: T, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanupTitle(element.innerText),
    };
}

export function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanupTitle(anchor.title)
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+-raw-free\/$/, 'article#item-detail h1.title-detail', MangaLinkExtractor<HTMLHeadingElement>)
@Common.MangasMultiPageCSS('article.item div.image > a', Common.PatternLinkGenerator('/page/{page}/'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.list-chapter ul li a')
export default class extends DecoratableMangaScraper {

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('spoilerplus', 'SpoilerPlus', 'https://spoilerplus.tv', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
        }
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const body = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), `({ m: window.MangaId, n: window.CNumber });`, 500);
        const { c: encryptedScrambleData, d: encryptedImageBaseURL, e: images } = await FetchJSON<ChapterCryptedData>(new Request(new URL('./api/v1/get/c', this.URI), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }));

        const decryptedScrambleData = encryptedScrambleData ? this.Decrypt(encryptedScrambleData).split(',').map(Number) : undefined;
        return images.map(image => new Page<PageData>(this, chapter, new URL(this.Decrypt(encryptedImageBaseURL) + image), {
            Referer: this.URI.origin,
            ScrambleArray: decryptedScrambleData,
        }));
    }

    private Decrypt(encrypted: string, keyData: string = this.URI.host): string {
        const key = Uint8Array.of(GetBytesFromUTF8(keyData).reduce((acc, b) => acc ^ b, 0));
        return GetUTF8FromBytes(XOR(GetBytesFromHex(encrypted), key));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const { ScrambleArray } = page.Parameters;
        return !ScrambleArray ? blob : DeScramble(blob, async (image, ctx) => {

            const scrambleData = this.ComputePieces(ScrambleArray, image);
            scrambleData.forEach(piece => {
                let source = piece.from,
                    dest = piece.to;
                if (source && dest) {
                    ctx.drawImage(image, dest.left, dest.top, dest.width, dest.height, source.left, source.top, source.width, source.height);
                }
            });
        });
    }

    private ComputePieces(skey: number[], image: ImageBitmap): TPuzzleData[] {
        const numColAndRow = 4;
        const dimensions: TDimension = {
            width: image.width,
            height: image.height,
        };
        return skey.map((pieceindex, index) => {
            return {
                from: this.ComputePiece(dimensions, numColAndRow, index),
                to: this.ComputePiece(dimensions, numColAndRow, pieceindex),
            };
        });
    }

    private ComputePiece(dimensions: TDimension, numColAndRow: number, pieceIndex: number): TPiece {
        const { width, height } = dimensions;
        const totalGridPieces = numColAndRow * numColAndRow;
        const pieceWidth = Math.floor(width / numColAndRow);
        const pieceHeight = Math.floor(height / numColAndRow);

        if (pieceIndex < totalGridPieces) {
            const column = pieceIndex % numColAndRow;
            const row = Math.floor(pieceIndex / numColAndRow);
            return {
                left: column * pieceWidth,
                top: row * pieceHeight,
                width: pieceWidth,
                height: pieceHeight,
            };
        }

        if (pieceIndex === totalGridPieces) {
            const remainingWidth = width % numColAndRow;
            if (remainingWidth === 0) {
                return null;
            }
            return {
                left: width - remainingWidth,
                top: 0,
                width: remainingWidth,
                height,
            };
        }

        const remainingHeight = height % numColAndRow;
        if (remainingHeight === 0) {
            return null;
        }
        return {
            left: 0,
            top: height - remainingHeight,
            width: width - width % numColAndRow,
            height: remainingHeight,
        };
    }
}
