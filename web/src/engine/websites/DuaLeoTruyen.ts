import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchHTML, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromURLBase64, GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { XOR } from '../Crypto';
import { LCG } from '../Random';

type PagesConfig = {
    a: string; // img & canvas attribute
    b: string; //secondary attribute
    c: number; // LCG increment
    cc: string; //canvas class
    ci: string; //image class
    k: string; //secret key for HMAC (hex string)
    m: number; //LCG multiplier
    p: string; // version prefix
    s: string; // encrypted message attribute
};

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen > a:has(img)', Common.PatternLinkGenerator('/truyen-hoan-thanh?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLDivElement>('div.name').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyengf.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // Latest Domain: https://www.facebook.com/dualeotruyen2/about
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin;`, 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterURL = new URL(chapter.Identifier, this.URI);

        //1) get elements and config from chapter page
        const doc = await FetchHTML(new Request(chapterURL, {
            headers: {
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin'
            }
        }));

        const configData = doc.querySelector<HTMLScriptElement>('script[data-v]')?.dataset.v;
        const tmp = GetBytesFromURLBase64(configData.split('').reverse().join(''));
        const buffer = tmp.slice(1);

        const rng = LCG(tmp[0], 29, 71, 256);
        buffer.forEach((byte, index) => {
            buffer[index] = byte ^ rng.next().value * 2 ** 32;
        });

        const cfg = <PagesConfig>JSON.parse(GetUTF8FromBytes(buffer));
        const { a, ci, cc } = cfg;

        //2) fetch images element and decrypt urls
        const targets = `img.${ci}[${a}], canvas.${cc}[${a}]`;
        const imgs = [...doc.querySelectorAll<HTMLImageElement | HTMLCanvasElement>(targets)];

        //filter decoys pages :D
        const pages = await Promise.all(
            imgs.map(async (element) => {
                const link = await this.PageExtractor(element, cfg);
                return link ? new Page(this, chapter, new URL(link, chapterURL), { Referer: this.URI.href }) : null;
            })
        );
        return pages.filter(page => page);
    }

    private async PageExtractor(img: HTMLImageElement | HTMLCanvasElement, cfg: PagesConfig): Promise<string|null> {
        let result = null;
        const { a, b, s, m, c, p, k } = cfg;

        //1) Decode URL: 1st pass ("unpack")
        const buffer = GetBytesFromURLBase64(`${img.getAttribute(b)}${img.getAttribute(a)}`);
        const rng = LCG(parseInt(img.getAttribute(s)), m, c, 256);
        buffer.forEach((byte, index) => {
            buffer[index] = byte ^ rng.next().value * 2 ** 32;
        });

        const uri = new URL(GetUTF8FromBytes(buffer));
        let [, basename, extension] = uri.pathname.match(/\/([^./]+)\.(.*)$/);
        if (!basename.startsWith(p)) return uri.href;

        //2) Decode the filename from the full url: 2nd pass (play with crypto)
        try {
            basename = basename.slice(p.length);
            const payload = GetUTF8FromBytes(GetBytesFromURLBase64(basename));

            // V6|nonce|salt|mac|base64(cipher)
            const [version, nonce, salt, mac, rawB64] = payload.split('|');

            if (version !== 'V6' || !mac || !nonce || !salt || !rawB64) return uri.href;

            const cipher = GetBytesFromBase64(rawB64);

            let stream: number[] = [];
            for (let counter = 0; stream.length < cipher.length; counter++) {
                const block = new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(`${k}|STREAM|${nonce}|${salt}|${counter}`)));
                stream = [...stream, ...block];
            }

            const name = GetUTF8FromBytes(XOR(cipher, new Uint8Array(stream)));

            //HMAC is used to filter decoys (fake pages)
            const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(k), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const signature = GetHexFromBytes(new Uint8Array(await crypto.subtle.sign('HMAC', key, GetBytesFromUTF8(`V6|${nonce}|${salt}|${name}`))));

            if (mac == signature) {
                uri.pathname = uri.pathname.split('/').toSpliced(-1, 1, `${name}.${extension}`).join('/');
                result = uri.href;
                //console.log(`real page : ${result}`);

            } else {
                //console.log(`Decoy : ${name}`);
                result = null;
            }

        } catch { }

        return result;
    }
}