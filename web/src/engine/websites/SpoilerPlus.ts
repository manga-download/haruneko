import { Tags } from '../Tags';
import icon from './SpoilerPlus.webp';
import {type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

const pageScript = `
    new Promise( resolve => {

        function XOR(magikstring, MCONFIG_I) {
            const toByteArray = a => {
                return a.split('').map(letter => {
                    return letter.charCodeAt(0);
                });
            };
            const xorIt = a => {
                return toByteArray(magikstring).reduce((a, b) => {
                    return a ^ b;
                }, a);
            };
            return MCONFIG_I.match(/.{1,2}/g).map(a => {
                return parseInt(a, 16);
            }).map(xorIt).map(a => {
                return String.fromCharCode(a);
            }).join('');
        }

        const magicString = 'TeH4lL9P3byk27t0';
        const c = window.__M_CONFIG.c || '';
        const url = window.location.protocol + '//' + window.location.host;
        const i = window.__M_CONFIG.i || '';
        const s = window.__M_CONFIG.s || false;

        const cdn = XOR(url, c);
        const images = [...document.querySelectorAll('{queryPages}')].map(image => new URL(image.dataset.z, cdn).href);

        if (!s) {
            resolve({images, scrambleArray : undefined });
        } else {
            const scrambleSeed = XOR(magicString, i);
            let difference = 0;
            const divClasses = document.getElementById('cchapter') ? [...document.getElementById('cchapter').classList]: undefined;
            const ccChapterRgx = /cchapter-(\\d+)/;
            if (divClasses) {
                const goodClass = divClasses.find(element => ccChapterRgx.test(element));
                if (goodClass) {
                    difference = parseInt(goodClass.match(ccChapterRgx)[1]);
                }
            }
            const scrambleArray = scrambleSeed.match(/.{1,2}/g).map(a => {
                return parseInt(a) - difference;
            });
            resolve({images , scrambleArray });
        }
    });

`;

type PageData = {
    scrambleArray: number[],
    images: string[]
}

type TDimension = {
    height: number,
    width: number
}

type TPiece = {
    height: number,
    left: number,
    top: number,
    width: number
}

type TPuzzleData = {
    from: TPiece,
    to: TPiece
}

export function MangaLabelExtractor(element: HTMLElement): string {
    return StripCrap(element.textContent);
}
export function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: StripCrap(anchor.title)
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+-raw-free\/$/, 'article#item-detail h1.title-detail', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/page/{page}/', 'article.item div.image > a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.list-chapter ul li a')

export default class extends DecoratableMangaScraper {
    private readonly queryPages: string = '';

    public constructor(id = 'spoilerplus', label = 'SpoilerPlus', url = 'https://spoilerplus.tv', queryPages = 'div#post-comic div[data-z]', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked]) {
        super(id, label, url, ...tags);
        this.queryPages = queryPages;
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript<PageData>(new Request(new URL(chapter.Identifier, this.URI)), pageScript.replaceAll('{queryPages}', this.queryPages), 500);
        return data.images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.origin, scrambleArray: JSON.stringify(data.scrambleArray) }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.scrambleArray) return blob;
        const scrambleArray = JSON.parse(page.Parameters.scrambleArray as string) as number[];
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

            function COMPUTEPIECE(dimensions: TDimension, numColAndRow: number, pieceindex: number): TPiece {
                var c, d, e, f, g, h, i, k, l, m, n, o, p, q, r, s, t, numpieces;
                numpieces = numColAndRow * numColAndRow;
                return pieceindex < numpieces
                    ? (o = numColAndRow,
                    p = pieceindex,
                    q = (n = dimensions).width,
                    r = n.height,
                    s = Math.floor(q / o),
                    t = Math.floor(r / o),
                    {
                        left: p % o * s,
                        top: Math.floor(p / o) * t,
                        width: s,
                        height: t,
                    })
                    : pieceindex === numpieces
                        ? (i = numColAndRow,
                        k = (h = dimensions).width,
                        l = h.height,
                        0 == (m = k % i)
                            ? null
                            : {
                                left: k - m,
                                top: 0,
                                width: m,
                                height: l,
                            })
                        : (d = numColAndRow,
                        e = (c = dimensions).width,
                        0 == (g = (f = c.height) % d)
                            ? null
                            : {
                                left: 0,
                                top: f - g,
                                width: e - e % d,
                                height: g,
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

function StripCrap(text: string): string {
    return text.trim().replace(/Raw Free/i, '').trim();
}
