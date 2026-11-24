import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromURLBase64, GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { XOR } from '../Crypto';
import { LCG } from '../Random';

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
        const targets = 'img:is([data-x-a], [data-img]),canvas.chapter-v53-canvas[data-x-a],svg.chapter-svg-random:is([data-x-a], [data-svg-img])';
        const imgs = await FetchCSS<HTMLImageElement>(new Request(chapterURL, {
            headers: {
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin'
            }
        }), targets);
        return Promise.all(
            imgs.map(async (element) => {
                const link = new URL(await this.PageExtractor(element), chapterURL);
                return new Page(this, chapter, link, { Referer: this.URI.href });
            })
        );
    }

    private async PageExtractor(img: HTMLImageElement | HTMLCanvasElement): Promise<string> {

        if (!(img.hasAttribute('data-x-a') || img.hasAttribute('data-img') || img.hasAttribute('data-svg-img'))) return;

        const legacy = img.dataset.img ?? img.dataset.svgImg;
        if (legacy) return legacy;

        const buffer = GetBytesFromURLBase64(`${img.dataset.xB}${img.dataset.xA}`);
        const rng = LCG(parseInt(img.dataset.xK), 33, 17, 256);
        buffer.forEach((byte, index) => {
            buffer[index] = byte ^ rng.next().value * 2 ** 32;
        });

        const secret = 'dualeo_url_v5_M4nP_2026_Z7cL';

        const uri = new URL(GetUTF8FromBytes(buffer));
        let [, basename, extension] = uri.pathname.match(/\/([^./]+)\.(.*)$/);
        if (!basename.startsWith('q5_')) return uri.href;

        try {
            basename = basename.slice(3);
            const payload = GetUTF8FromBytes(GetBytesFromURLBase64(basename));

            // V5|nonce|salt|mac|base64(cipher)
            const [version, nonce, salt, mac, rawB64] = payload.split('|');

            if (version !== 'V5' || !mac || !nonce || !salt || !rawB64) return uri.href;

            const cipher = GetBytesFromBase64(rawB64);

            let stream: number[] = [];
            for (let counter = 0; stream.length < cipher.length; counter++) {
                const block = new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(`${secret}|STREAM|${nonce}|${salt}|${counter}`)));
                stream = [...stream, ...block];
            }

            const name = GetUTF8FromBytes(XOR(cipher, new Uint8Array(stream)));

            //HMAC
            const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const signature = GetHexFromBytes(new Uint8Array( await crypto.subtle.sign('HMAC', key, GetBytesFromUTF8(`V5|${nonce}|${salt}|${name}`))));

            if (mac == signature)
                uri.pathname = uri.pathname.split('/').toSpliced(-1, 1, `${name}.${extension}`).join('/');

        } catch { }

        return uri.href;
    }
}