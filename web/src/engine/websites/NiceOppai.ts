import { Tags } from '../Tags';
import icon from './NiceOppai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type JSImageData = {
    url: string,
    pieces?: ImagePiece[]
};

type ImagePiece = {
    destinationX: number,
    destinationY: number,
    sourceX: number,
    sourceY: number,
    width: number,
    height: number
};

type PageParameters = {
    pieces?: ImagePiece[]
};

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img')?.getAttribute('alt')?.split(' - ')[0].trim() || anchor.textContent.trim()
    };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLElement>('.chrow__t').textContent.trim()
    };
}

const pageScript = String.raw`
    (() => {
        const decodeLiteral = value => value.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|n|r|t|b|f|v|0|'|"|\\|\/)/g, (_, escape) => {
            if (escape[0] === 'u') return String.fromCharCode(Number.parseInt(escape.slice(1), 16));
            if (escape[0] === 'x') return String.fromCharCode(Number.parseInt(escape.slice(1), 16));
            return ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', 0: '\0' })[escape] ?? escape;
        });

        const encode = (value, radix) => {
            const digit = value % radix;
            const suffix = digit > 35 ? String.fromCharCode(digit + 29) : digit.toString(36);
            return value < radix ? suffix : encode(Math.floor(value / radix), radix) + suffix;
        };

        const unpack = source => {
            const match = source.trim().match(/\}\('((?:\\.|[^'])*)',(\d+),(\d+),'((?:\\.|[^'])*)'\.split\('\|'\),0,\{\}\)\)$/s);
            if (!match) throw new Error('Unsupported P.A.C.K.E.R. payload');

            let payload = decodeLiteral(match[1]);
            const radix = Number(match[2]);
            const count = Number(match[3]);
            const words = decodeLiteral(match[4]).split('|');
            if (!Number.isInteger(radix) || radix < 2 || radix > 62 || !Number.isInteger(count) || count < 1) {
                throw new Error('Invalid P.A.C.K.E.R. parameters');
            }

            for (let index = count - 1; index >= 0; index--) {
                if (words[index]) payload = payload.replace(new RegExp('\\b' + encode(index, radix) + '\\b', 'g'), words[index]);
            }
            return payload;
        };

        const validateAndExtract = (placeholder, data) => {
            const url = new URL(data.u ?? data.url, location.href);
            const width = Number(data.w ?? data.width);
            const height = Number(data.h ?? data.height);
            const tileWidth = Number(data.px ?? data.x);
            const tileHeight = Number(data.py ?? data.v);
            const map = data.map ?? data.t;
            if (url.protocol !== 'https:' || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0 ||
                !Number.isFinite(tileWidth) || tileWidth <= 0 || !Number.isFinite(tileHeight) || tileHeight <= 0 || !Array.isArray(map) || !map.length) {
                throw new Error('Invalid protected image configuration for ' + placeholder.id);
            }

            const sources = new Set();
            const destinations = new Set();
            const pieces = map.map(piece => {
                if (!Array.isArray(piece) || piece.length !== 4 || piece.some(value => !Number.isFinite(Number(value)))) {
                    throw new Error('Invalid tile mapping for ' + placeholder.id);
                }
                const [destinationX, destinationY, sourceX, sourceY] = piece.map(Number);
                if (sourceX < 0 || sourceY < 0 || destinationX < 0 || destinationY < 0 ||
                    sourceX + tileWidth > width || sourceY + tileHeight > height ||
                    destinationX + tileWidth > width || destinationY + tileHeight > height) {
                    throw new Error('Tile mapping outside image bounds for ' + placeholder.id);
                }
                sources.add(sourceX + ',' + sourceY);
                destinations.add(destinationX + ',' + destinationY);
                return { destinationX, destinationY, sourceX, sourceY, width: tileWidth, height: tileHeight };
            });
            if (sources.size !== pieces.length || destinations.size !== pieces.length) {
                throw new Error('Duplicate tile mapping for ' + placeholder.id);
            }
            return { url: url.href, pieces };
        };

        const extractPackedImage = placeholder => {
            const script = placeholder.nextElementSibling;
            if (!(script instanceof HTMLScriptElement)) throw new Error('Missing protected image script for ' + placeholder.id);
            const decoded = unpack(script.textContent);
            const invocation = decoded.match(/^[^(]+\("([^"]+)",(\{.*\})\);?$/s);
            if (!invocation) throw new Error('Invalid protected image invocation for ' + placeholder.id);
            if (invocation[1] !== placeholder.id) throw new Error('Protected image ID mismatch for ' + placeholder.id);
            return validateAndExtract(placeholder, JSON.parse(invocation[2]));
        };

        const extractRenderedImage = placeholder => {
            const source = placeholder.querySelector(':scope > img');
            if (!source?.src) return null;
            const pieces = [...placeholder.querySelectorAll(':scope > div')].map(tile => {
                const [backgroundX = '0', backgroundY = '0'] = tile.style.backgroundPosition.split(/\s+/);
                const pixel = value => Number.parseFloat(value) || 0;
                return {
                    destinationX: pixel(tile.style.left),
                    destinationY: pixel(tile.style.top),
                    sourceX: -pixel(backgroundX),
                    sourceY: -pixel(backgroundY),
                    width: pixel(tile.style.width),
                    height: pixel(tile.style.height)
                };
            }).filter(piece => piece.width > 0 && piece.height > 0);
            return pieces.length ? { url: source.src, pieces } : null;
        };

        const protector = window.NPFXTVH;
        if (protector?.forceCssAll) protector.forceCssAll();

        return [...document.querySelectorAll('div#image-container > center')].flatMap(center => {
            const directImage = center.querySelector(':scope > img');
            if (directImage?.src) return [{ url: directImage.src }];

            const protectedImage = center.querySelector(':scope > div[id^="image"]');
            if (!protectedImage) throw new Error('Unrecognized image entry in NiceOppai reader');
            const rendered = extractRenderedImage(protectedImage);
            return [rendered ?? extractPackedImage(protectedImage)];
        });
    })();
`;

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1')
@Common.MangasMultiPageCSS('a.fcard__title', Common.PatternLinkGenerator('/manga_list/all/any/name-az/{page}/'), 0, MangaInfoExtractor)
@Common.ChaptersMultiPageCSS('a.chrow', Common.PatternLinkGenerator('{id}chapter-list/{page}/'), 0, ChapterInfoExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niceoppai', 'NiceOppai', 'https://www.niceoppai.net', Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new Request(uri, {
            headers: {
                Referer: new URL(chapter.Parent.Identifier, this.URI).href
            }
        });
        const images = await FetchWindowScript<JSImageData[]>(request, pageScript);
        return images.map(({ url, pieces }) => new Page<PageParameters>(this, chapter, new URL(url, uri), { Referer: uri.href, pieces }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.pieces?.length) return blob;

        return DeScramble(blob, async (image, context) => {
            // NiceOppai leaves pixels outside its 2 x 5 tile grid untouched (usually the last two rows).
            context.drawImage(image, 0, 0);
            for (const piece of page.Parameters.pieces) {
                context.drawImage(
                    image,
                    piece.sourceX,
                    piece.sourceY,
                    piece.width,
                    piece.height,
                    piece.destinationX,
                    piece.destinationY,
                    piece.width,
                    piece.height
                );
            }
        });
    }
}
