import { type Tag, Tags } from '../Tags';
import icon from './MangaFire.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIResult<T> = {
    result: T,
};

type APIChapters = APIResult<{
    html: string;
}>;

type APIPages = APIResult<{
    images: [[string, never, number]];
}>;

type PageParameters = {
    blockScramblingOffset?: number;
};

const chapterLanguageMap = new Map<string, Tag>([
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['ja', Tags.Language.Japanese],
    ['pt-br', Tags.Language.Portuguese],
]);

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.info h1[itemprop="name"]', (head, uri) => ({ id: uri.pathname.split('.').at(-1), title: head.innerText.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.info > a', Common.PatternLinkGenerator('/az-list?page={page}'), 250, anchor => ({ id: anchor.pathname.split('.').at(-1), title: anchor.title }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangafire', `MangaFire`, 'https://mangafire.to', Tags.Language.English, Tags.Language.French, Tags.Language.Japanese, Tags.Language.Portuguese, Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const types = ['chapter', 'volume'];
        // TODO: May extract available languages from manga website => div.list-menu div.dropdown-menu a.dropdown-item[data-code]
        for (const language of chapterLanguageMap.keys()) {
            for (const type of types) {
                const { result: { html } } = await this.FetchAJAX<APIChapters>(manga.Identifier, type, language);
                const chapters = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('a')]
                    .filter(anchor => anchor.pathname.includes(`/${type}-`))
                    .map(anchor => new Chapter(this, manga, `${type}/${anchor.dataset.id}`, `${anchor.text.trim()} (${language})`, chapterLanguageMap.get(language)));
                chapterList.push(...chapters);
            }
        }
        return chapterList.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { result: { images } } = await this.FetchAJAX<APIPages>(...chapter.Identifier.split('/'));
        return images.map(([url, _, offset]) => new Page<PageParameters>(this, chapter, new URL(url), { Referer: this.URI.href, blockScramblingOffset: offset }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters?.blockScramblingOffset > 0 ? DeScramble(blob, (source, target) => Render(source, target, page.Parameters.blockScramblingOffset)) : blob;
    }

    private FetchAJAX<T extends JSONElement>(...endpoint: string[]): Promise<T> {
        const uri = new URL(['', 'ajax', 'read', ...endpoint].join('/'), this.URI.origin);
        uri.searchParams.set('vrf', VRF(endpoint.join('@').replaceAll(`'`, `\\'`)));
        return FetchJSON<T>(new Request(uri, {
            headers: {
                'Referer': this.URI.href,
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));
    }
}

async function Render(image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, blockScramblingOffset: number): Promise<void> {
    ctx.clearRect(0, 0, image.width, image.height);
    const blockCount = 5;
    const blockWidth = Math.min(200, Math.ceil(image.width / blockCount));
    const blockHeight = Math.min(200, Math.ceil(image.height / blockCount));
    const blockRowCount = Math.ceil(image.width / blockWidth) - 1;
    const blockColumnCount = Math.ceil(image.height / blockHeight) - 1;

    for (let targetBlockColumn = 0, sourceBlockColumn = 0; targetBlockColumn <= blockColumnCount; targetBlockColumn++) {
        for (let targetBlockRow = 0, sourceBlockRow = 0; targetBlockRow <= blockRowCount; targetBlockRow++) {
            sourceBlockRow = targetBlockRow;
            sourceBlockColumn = targetBlockColumn;
            if (targetBlockRow < blockRowCount) {
                sourceBlockRow = (blockRowCount - targetBlockRow + blockScramblingOffset) % blockRowCount;
            }
            if (targetBlockColumn < blockColumnCount) {
                sourceBlockColumn = (blockColumnCount - targetBlockColumn + blockScramblingOffset) % blockColumnCount;
            }

            ctx.drawImage(
                image,
                sourceBlockRow * blockWidth,
                sourceBlockColumn * blockHeight,
                Math.min(blockWidth, image.width - targetBlockRow * blockWidth),
                Math.min(blockHeight, image.height - targetBlockColumn * blockHeight),
                targetBlockRow * blockWidth,
                targetBlockColumn * blockHeight,
                Math.min(blockWidth, image.width - targetBlockRow * blockWidth),
                Math.min(blockHeight, image.height - targetBlockColumn * blockHeight)
            );
        }
    }
}

/* eslint-disable semi */
/* eslint-disable @stylistic/no-extra-parens */

// Extracted from website script
// TODO: May be simplified ...
function VRF(signature: string) {

    var atob_ = atob;
    var btoa_ = btoa;

    var toBytes = function (str) {
        var bytes = [];
        for (var i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i) & 255)
        }
        return bytes
    };

    var fromBytes = function (bytes) {
        var str = "";
        for (var i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i] & 255)
        }
        return str
    };

    function rc4Bytes(key, input) {
        var s = [];
        for (var i = 0; i < 256; i++) {
            s[i] = i
        }
        var j = 0;
        for (var i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) & 255;
            var temp = s[i];
            s[i] = s[j];
            s[j] = temp
        }
        var out = new Array(input.length);
        i = 0;
        j = 0;
        for (var y = 0; y < input.length; y++) {
            i = (i + 1) & 255;
            j = (j + s[i]) & 255;
            var temp = s[i];
            s[i] = s[j];
            s[j] = temp;
            var k = s[(s[i] + s[j]) & 255];
            out[y] = (input[y] ^ k) & 255
        }
        return out
    }

    function transform(input, initSeedBytes, prefixKeyString, prefixLen, schedule) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if (i < prefixLen) out.push(prefixKeyString.charCodeAt(i) & 255);
            out.push(schedule[i % 10]((input[i] ^ initSeedBytes[i % 32]) & 255) & 255)
        }
        return out
    }

    var add8 = function (n) {
        return function (c) {
            return (c + n) & 255
        }
    };

    var sub8 = function (n) {
        return function (c) {
            return (c - n + 256) & 255
        }
    };

    var xor8 = function (n) {
        return function (c) {
            return c ^ n
        }
    };

    var rotl8 = function (n) {
        return function (c) {
            return ((c << n) | (c >>> (8 - n))) & 255
        }
    };

    var scheduleC = [sub8(48), sub8(19), xor8(241), sub8(19), add8(223), sub8(19), sub8(170), sub8(19), sub8(48), xor8(8),];
    var scheduleY = [rotl8(4), add8(223), rotl8(4), xor8(163), sub8(48), add8(82), add8(223), sub8(48), xor8(83), rotl8(4),];
    var scheduleB = [sub8(19), add8(82), sub8(48), sub8(170), rotl8(4), sub8(48), sub8(170), xor8(8), add8(82), xor8(163),];
    var scheduleJ = [add8(223), rotl8(4), add8(223), xor8(83), sub8(19), add8(223), sub8(170), add8(223), sub8(170), xor8(83),];
    var scheduleE = [add8(82), xor8(83), xor8(163), add8(82), sub8(170), xor8(8), xor8(241), add8(82), add8(176), rotl8(4),];

    function base64UrlEncodeBytes(bytes) {
        var std = btoa_(fromBytes(bytes));
        return std.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    }

    function bytesFromBase64(b64) {
        return toBytes(atob_(b64))
    }

    var CONST = {
        rc4Keys: {
            l: "u8cBwTi1CM4XE3BkwG5Ble3AxWgnhKiXD9Cr279yNW0=",
            g: "t00NOJ/Fl3wZtez1xU6/YvcWDoXzjrDHJLL2r/IWgcY=",
            B: "S7I+968ZY4Fo3sLVNH/ExCNq7gjuOHjSRgSqh6SsPJc=",
            m: "7D4Q8i8dApRj6UWxXbIBEa1UqvjI+8W0UvPH9talJK8=",
            F: "0JsmfWZA1kwZeWLk5gfV5g41lwLL72wHbam5ZPfnOVE=",
        },
        seeds32: {
            A: "pGjzSCtS4izckNAOhrY5unJnO2E1VbrU+tXRYG24vTo=",
            V: "dFcKX9Qpu7mt/AD6mb1QF4w+KqHTKmdiqp7penubAKI=",
            N: "owp1QIY/kBiRWrRn9TLN2CdZsLeejzHhfJwdiQMjg3w=",
            P: "H1XbRvXOvZAhyyPaO68vgIUgdAHn68Y6mrwkpIpEue8=",
            k: "2Nmobf/mpQ7+Dxq1/olPSDj3xV8PZkPbKaucJvVckL0=",
        },
        prefixKeys: {
            O: "Rowe+rg/0g==",
            v: "8cULcnOMJVY8AA==",
            L: "n2+Og2Gth8Hh",
            p: "aRpvzH+yoA==",
            W: "ZB4oBi0=",
        },
    };

    function crc_vrf(input) {
        var bytes = toBytes(encodeURIComponent(input));
        bytes = rc4Bytes(atob_(CONST.rc4Keys.l), bytes);
        bytes = transform(bytes, bytesFromBase64(CONST.seeds32.A), atob_(CONST.prefixKeys.O), 7, scheduleC);
        bytes = rc4Bytes(atob_(CONST.rc4Keys.g), bytes);
        bytes = transform(bytes, bytesFromBase64(CONST.seeds32.V), atob_(CONST.prefixKeys.v), 10, scheduleY);
        bytes = rc4Bytes(atob_(CONST.rc4Keys.B), bytes);
        bytes = transform(bytes, bytesFromBase64(CONST.seeds32.N), atob_(CONST.prefixKeys.L), 9, scheduleB);
        bytes = rc4Bytes(atob_(CONST.rc4Keys.m), bytes);
        bytes = transform(bytes, bytesFromBase64(CONST.seeds32.P), atob_(CONST.prefixKeys.p), 7, scheduleJ);
        bytes = rc4Bytes(atob_(CONST.rc4Keys.F), bytes);
        bytes = transform(bytes, bytesFromBase64(CONST.seeds32.k), atob_(CONST.prefixKeys.W), 5, scheduleE);
        return base64UrlEncodeBytes(bytes)
    }

    return crc_vrf(signature);
}

/* eslint-enable semi */
/* eslint-enable @stylistic/no-extra-parens */