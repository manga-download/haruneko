import { Tags } from '../Tags';
import icon from './SpoilerPlus.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

const pageScript = `
    new Promise (resolve =>{
        resolve ({ mangaId: window.MangaId, chapterId : window.CNumber});
    });
`;

type ChapterData = {
    mangaId: number;
    chapterId: number;
};

type ChapterCryptedData = {
    c: string; //SCRAMBLEDATA
    d: string; //CDN
    e: string[]; //Array of pathnames to append to CDN
};

type PageData = {
    scrambleArray: number[],
};

type TDimension = {
    height: number,
    width: number;
};

type TPiece = {
    height: number,
    left: number,
    top: number,
    width: number;
};

type TPuzzleData = {
    from: TPiece,
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

    private readonly queryPages: string = '';

    public constructor(id = 'spoilerplus', label = 'SpoilerPlus', url = 'https://spoilerplus.tv', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { mangaId, chapterId } = await FetchWindowScript<ChapterData>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 500);
        const { c, d, e } = await FetchJSON<ChapterCryptedData>(new Request(new URL('./api/v1/get/c', this.URI), {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ m: mangaId, n: chapterId })
        }));

        const key = this.URI.host;
        const scrambleArray = this.XOR(key, c).split(',').map(Number);
        const CDN = this.XOR(key, d);
        return e.map(image => new Page<PageData>(this, chapter, new URL(CDN + image), { Referer: this.URI.origin, scrambleArray }));
    }

    private XOR(key: string, value: string): string {
        const toByteArray = a => {
            return a.split('').map(letter => {
                return letter.charCodeAt(0);
            });
        };
        const xorIt = a => {
            return toByteArray(key).reduce((a, b) => {
                return a ^ b;
            }, a);
        };
        return value.match(/.{1,2}/g).map(a => {
            return parseInt(a, 16);
        }).map(xorIt).map(a => {
            return String.fromCharCode(a);
        }).join('');
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.scrambleArray) return blob;
        const { scrambleArray } = page.Parameters;
        return DeScramble(blob, async (image, ctx) => {
            function COMPUTEPIECES(skey: number[], image: ImageBitmap): TPuzzleData[] {
                const numColAndRow = 4;
                const dimensions: TDimension = {
                    width: image.width,
                    height: image.height,
                };
                return skey.map((pieceindex, index) => {
                    return {
                        from: COMPUTEPIECE(dimensions, numColAndRow, index),
                        to: COMPUTEPIECE(dimensions, numColAndRow, pieceindex),
                    };
                });
            }

            const scrambleData = COMPUTEPIECES(scrambleArray, image);
            scrambleData.forEach(piece => {
                let source = piece.from,
                    dest = piece.to;
                if (source && dest) {
                    ctx.drawImage(image, dest.left, dest.top, dest.width, dest.height, source.left, source.top, source.width, source.height);
                }
            });
        });
    }
}

function COMPUTEPIECE(dimensions: TDimension, numColAndRow: number, pieceindex: number): TPiece {
    let c, d, e, f, g, h, i, k, l, m, n, o, p, q, r, s, t, numpieces;
    numpieces = numColAndRow * numColAndRow;
    return pieceindex < numpieces ? (o = numColAndRow, p = pieceindex, q = (n = dimensions).width, r = n.height, s = Math.floor(q / o), t = Math.floor(r / o), {
        left: p % o * s,
        top: Math.floor(p / o) * t,
        width: s,
        height: t,
    }) : pieceindex === numpieces ? (i = numColAndRow, k = (h = dimensions).width, l = h.height, 0 == (m = k % i) ? null : {
        left: k - m,
        top: 0,
        width: m,
        height: l,
    }) : (d = numColAndRow, e = (c = dimensions).width, 0 == (g = (f = c.height) % d) ? null : {
        left: 0,
        top: f - g,
        width: e - e % d,
        height: g,
    });
}