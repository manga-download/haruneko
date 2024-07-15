import { Tags } from '../Tags';
import icon from './MangaReaderTo.webp';
import type { Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type AJAXResponse = {
    status: boolean,
    html: string
}

type TSlice = {
    x: number,
    y: number,
    width: number,
    height: number
}

type TGroup = {
    slices: number,
    cols: number,
    rows: number,
    x: number,
    y: number
}

function ChapterExtractor(element: HTMLElement) {
    const link = element instanceof HTMLAnchorElement ? (element as HTMLAnchorElement).pathname : element.querySelector<HTMLAnchorElement>('a').pathname;
    const title = element instanceof HTMLAnchorElement ? element.title.replace(/([^:]*):(.*)/, (match, g1, g2) => g1.trim().toLowerCase() === g2.trim().toLowerCase() ? g1 : match).trim() : element.textContent.trim();
    const lang = link.match(/\/read\/[^/]+\/([^/]+)/)[1];
    return {
        id: link,
        title: `${title} (${lang})`,
    };

}

@Common.MangaCSS(/^{origin}\/[^/]+-\d+$/, 'div#ani_detail div.anisc-detail h2.manga-name')
@Common.MangasMultiPageCSS('/az-list?page={page}', '#main-content div.manga-detail h3 a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div.chapters-list-ul ul li a, div.volume-list-ul div.manga-poster', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangareaderto', `MangaReader.to`, 'https://mangareader.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const [{ dataset: { readingId } }] = await FetchCSS(new Request(chapterurl), 'div#wrapper');

        const uri = new URL(`ajax/image/list/${chapterurl.href.includes('chapter') ? 'chap' : 'vol'}/${readingId}?quality=high`, this.URI);
        const { status, html } = await FetchJSON<AJAXResponse>(new Request(uri));
        if (status !== true ) return [];

        const dom = new DOMParser().parseFromString(html, 'text/html');
        const imagesArr = [...dom.querySelectorAll<HTMLDivElement>('div.iv-card')];
        return imagesArr.map(image => new Page(this, chapter, new URL(image.dataset.url, this.URI), { shuffled: image.classList.contains('shuffled') }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters['shuffled'] ? blob : DeScramble(blob, async (image, ctx) => {

            const blockDimension = 200;
            const defaultSeed = 'stay';
            const numBlocks = Math.ceil(image.width / blockDimension) * Math.ceil(image.height / blockDimension);
            const numColumns = Math.ceil(image.width / blockDimension);
            const slicesMap = new Map<string, TSlice[]>();
            for (let index = 0; index < numBlocks; index++) {
                const columnNumber = Math.trunc(index / numColumns);
                const slice: TSlice = { x: (index - columnNumber * numColumns) * blockDimension, y: columnNumber * blockDimension, width: undefined, height: undefined };

                slice.width = Math.min(image.width - slice.x, blockDimension);
                slice.height = Math.min(image.height - slice.y, blockDimension);

                const currentkey = slice.width.toString() + '-' + slice.height.toString();
                if (!slicesMap.has(currentkey)) slicesMap.set(currentkey, []);
                slicesMap.get(currentkey).push(slice);
            }
            for (const slices of slicesMap.values()) {
                const scrambleArray = unShuffle(createRange(0, slices.length), defaultSeed);
                const group = getGroup(slices);

                slices.forEach((slice, index) => {
                    let n = scrambleArray[index];
                    let o = Math.trunc(n / group.cols);
                    n = (n - o * group.cols) * slice.width;
                    o = o * slice.height;
                    ctx.drawImage(image,
                        group.x + n,
                        group.y + o,
                        slice.width,
                        slice.height,
                        slice.x,
                        slice.y,
                        slice.width,
                        slice.height
                    );
                });
            }

        });

    }

}

function unShuffle(numArray: number[], seed: string): number[] {
    if (!Array.isArray(numArray)) {
        return null;
    }
    const c = numArray.length,
        d = seedrandom(seed);
    const arr: number[] = [],
        arr2 = [];
    for (let index = 0; index < c; index++) {
        arr.push(null);
        arr2.push(index);
    }
    for (let index = 0; index < c; index++) {
        let e = seedRand(d, 0, arr2.length - 1),
            f = arr2[e];
        arr2.splice(e, 1);
        arr[f] = numArray[index];
    }
    return arr;
}

function seedRand(a, b: number, c: number): number {
    return Math.floor(a() * (c - b + 1)) + b;
}

function seedrandom(seed: string) {
    const significance = Math.pow(2, 52);
    const overflow = 2 * significance;
    let key = [];
    mixkey(seed, key);
    const arc4 = new ARC4(key);
    const prng = function () {
        let n = arc4.g(6),
            d = Math.pow(256, 6),
            x = 0;
        while (n < significance) {
            n = (n + x) * 256;
            d *= 256;
            x = arc4.g(1);
        }
        while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
        }
        return (n + x) / d;
    };
    return prng;
}

function mixkey(seed: string, key: number[]): string {
    let stringseed = seed + '', smear, j = 0;
    while (j < stringseed.length) {
        key[255 & j] =
            255 & (smear ^= key[255 & j] * 19) + stringseed.charCodeAt(j++);
    }
    return String.fromCharCode.apply(0, key);
}

function ARC4(key: number[]) {
    let t, keylen = key.length,
        me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

    if (!keylen) {
        key = [keylen++];
    }

    while (i < 256) {
        s[i] = i++;
    }
    for (i = 0; i < 256; i++) {
        s[i] = s[j = 255 & j + key[i % keylen] + (t = s[i])];
        s[j] = t;
    }

    (me.g = function (count) {
        let t, r = 0,
            i = me.i, j = me.j, s = me.S;
        while (count--) {
            t = s[i = 255 & i + 1];
            r = r * 256 + s[255 & (s[i] = s[j = 255 & j + t]) + (s[j] = t)];
        }
        me.i = i; me.j = j;
        return r;
    })(256);
}

function getGroup(slices: TSlice[]): TGroup {
    const cols = getColsInGroup(slices);
    return {
        rows: slices.length / cols,
        x: slices[0].x,
        y: slices[0].y,
        slices: slices.length,
        cols: cols
    };
}

function getColsInGroup(slices: TSlice[]): number {
    if (slices.length == 1) {
        return 1;
    }
    let t: string | number = 'init';
    for (let i = 0; i < slices.length; i++) {
        if (t == 'init') {
            t = slices[i].y;
        }
        if (t != slices[i].y) {
            return i;
        }
    }
    return slices.length;
}

function createRange(base: number, size: number, c: number = undefined): number[] {
    return (
        base = toFinite(base),
        void 0 === size ? (size = base, base = 0) : size = toFinite(size),
        baseRange(base, size, c = void 0 === c ? base < size ? 1 : -1 : toFinite(c), false)
    );
}

function baseRange(base: number, size: number, c: number, d: boolean): number[] {
    let e = -1,
        arraysize = Math.max(
            Math.ceil((size - base) / (c || 1)),
            0
        );
    const _array: number[] = new Array(arraysize);
    for (; arraysize--;) {
        _array[d ? arraysize : ++e] = base;
        base += c;
    }
    return _array;
}

function toFinite(a): number {
    return a ? (a = toNumber(a)) !== 1e400 && a !== -1e400 ? a == a ? a : 0 : 1.7976931348623157e308 * (a < 0 ? -1 : 1) : 0 === a ? a : 0;
}

function toNumber(a): number {
    let b;
    if ('number' == typeof a) {
        return a;
    }
    if (isSymbol(a)) {
        return NaN;
    }
    if ('string' != typeof (a = isObject(a) ? isObject(b = 'function' == typeof a.valueOf ? a.valueOf() : a) ? '' + b : b : a)) {
        return 0 === a ? a : +a;
    }
    a = a.replace(/^\s+|\s+$/g, '');
    b = /^0b[01]+$/i.test(a);
    return b || /^0o[0-7]+$/i.test(a)
        ? parseInt(a.slice(2), b ? 2 : 8)
        : /^[-+]0x[0-9a-f]+$/i.test(a)
            ? NaN
            : +a;
}

function isObject(a): boolean {
    const vartype = typeof a;
    return null != a && ('object' == vartype || 'function' == vartype);
}

function isSymbol(a): boolean {
    const vartype = typeof a;
    return 'symbol' == vartype || 'object' == vartype && null != a;
}
