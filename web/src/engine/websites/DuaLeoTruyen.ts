import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchHTML, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromHex, GetBytesFromURLBase64, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { XOR } from '../Crypto';
import { LCG } from '../Random';

type PagesConfig = {
    a: string; // image/canvas attribute
    b: string; // image/canvas attribute
    c: number; // increment for LCG
    cc: string; // canvas classes
    ci: string; // image classes
    e: string; // image attribute
    h: string[]; // CDN hosts
    k: string; // hex string => HMAC key
    m: number; // Multiplicator for LCG
    p: string; // random version prefix for image name
    t: string[]; //canvas tokens
    x: number; //seed mask
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
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyentj.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation, Tags.Rating.Pornographic);
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

        const cfg = this.ReadConfigFromScript(doc);
        const { cc, ci, a, t } = cfg;

        //2) fetch images element and decrypt urls

        //populate canvas properties
        const canvases = doc.querySelectorAll('canvas.' + cc);
        for (let index = 0; index < canvases.length; index++) {
            canvases[index].setAttribute('__v7', t[index]);
        }

        const targets = `img.${ci}[${a}], canvas.${cc}`;
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

    private async PageExtractor(img: HTMLImageElement | HTMLCanvasElement, cfg: PagesConfig): Promise<string | null> {
        let result = null;
        const uri = this.UnpackImageToken(img, cfg);

        const { k, p } = cfg;
        const secretBytes = GetBytesFromHex(k);

        let [, basename, extension] = uri.pathname.match(/\/([^./]+)\.(.*)$/);
        try {
            basename = basename.slice(p.length);
            const payload = GetBytesFromURLBase64(basename);

            const nonce = payload.subarray(0, 9);
            const cipher = payload.subarray(9, payload.length - 11);
            const mac = GetHexFromBytes(payload.subarray(payload.length - 11));

            //hash loop
            const stream = new Uint8Array(cipher.length);
            let filled = 0;
            let counter = 0;

            while (filled < cipher.length) {
                const material = new Uint8Array(secretBytes.length + 2 + nonce.length);
                material.set(secretBytes, 0);
                material[secretBytes.length] = counter >> 8 & 255;
                material[secretBytes.length + 1] = counter & 255;
                material.set(nonce, secretBytes.length + 2);
                counter++;

                // Native Web Crypto SHA-256
                const hashBuffer = await crypto.subtle.digest('SHA-256', material);
                const block = new Uint8Array(hashBuffer);

                const count = Math.min(block.length, cipher.length - filled);
                stream.set(block.subarray(0, count), filled);
                filled += count;
            }

            const nameBytes = XOR(cipher, new Uint8Array(stream));
            const message = new Uint8Array([...nameBytes, ...nonce]);

            //HMAC is used to filter decoys (fake pages)
            const key = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const signature = GetHexFromBytes(new Uint8Array(await crypto.subtle.sign('HMAC', key, message)));

            if (mac == signature.substring(0, 22)) {
                uri.pathname = uri.pathname.split('/').toSpliced(-1, 1, `${GetUTF8FromBytes(nameBytes)}.${extension}`).join('/');
                result = uri.href;
                //console.log(`real page : ${result}`);

            } else {
                //console.log(`Decoy : ${name}`);
                result = null;
            }

        } catch { }

        return result;
    }

    private ReadConfigFromScript(doc: HTMLDocument): PagesConfig {

        const scripts = Array.from(doc.querySelectorAll('script')).reverse();
        let configDatascript = null;
        let attributes: string[] = [];

        for (const script of scripts) {
            if (script.attributes.length < 4) {
                continue;
            }
            for (let attr of script.attributes) {
                if (/^data-[a-z][a-z0-9]{4,6}$/.test(attr.name)) {
                    attributes.push(attr.name);
                }
            }
            if (attributes.length === 4) {
                configDatascript = script;
                break;
            }
        };

        attributes.sort((a, b) => a < b ? 1 : -1);
        const raw = attributes.map(attr => configDatascript.getAttribute(attr)).join('');

        const decodedRaw = GetBytesFromURLBase64(raw);
        let state = decodedRaw.at(-1);
        const buffer = new Uint8Array(decodedRaw.slice(0, -1));

        const rng = LCG(state, 53, 203, 256);
        buffer.forEach((byte, index) => {
            buffer[index] = byte ^ rng.next().value;
        });

        const decryptedCfg = JSON.parse(GetUTF8FromBytes(buffer));
        return {
            e: decryptedCfg[0], h: decryptedCfg[1], x: decryptedCfg[2], cc: decryptedCfg[3], k: decryptedCfg[4], t: decryptedCfg[5],
            m: decryptedCfg[6], p: decryptedCfg[7], b: decryptedCfg[8], ci: decryptedCfg[9], c: decryptedCfg[10], a: decryptedCfg[11]
        };
    }

    private UnpackImageToken(img: HTMLImageElement | HTMLCanvasElement, cfg: PagesConfig): URL {
        const { a: attribute1, b: attribute2, e: attribute3, x: seedMask, m: multiplier, c: increment, h: hosts } = cfg;
        if (img instanceof HTMLCanvasElement) {
            return this.UnmaskToken(hosts, img.getAttribute('__v7'), seedMask ^ 0xC3, 77, 45, 11, false);
        }
        const raw = `${img.getAttribute(attribute1)}${img.getAttribute(attribute2)}${img.getAttribute(attribute3)}`;
        return this.UnmaskToken(hosts, raw, seedMask, multiplier, increment, 23, true);
    }

    private UnmaskToken(hosts: string[], token: string, seedMask: number, mul: number, add: number, mix: number, seedAtEnd: boolean): URL {

        const bytes = GetBytesFromURLBase64(token);
        const offset = seedAtEnd ? 0 : 1;
        const state = bytes[seedAtEnd ? bytes.length - 1 : 0] ^ seedMask;
        const decoded = new Uint8Array(bytes.length - 1);

        const rng = LCG(state, mul, add, 256);
        for (var i = 0; i < decoded.length; i++) {
            decoded[i] = bytes[i + offset] ^ rng.next().value ^ i * mix & 255;
        }

        const result = GetUTF8FromBytes(decoded);
        const hostIndex = result.charCodeAt(result.length - 1) - 97;

        return new URL(result.substring(0, result.length - 1), hosts[hostIndex]);
    }
}