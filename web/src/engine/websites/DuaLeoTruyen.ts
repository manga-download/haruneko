import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromURLBase64, GetBytesFromUTF8, GetHexFromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import { DecryptXOR } from '../Crypto';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen > a:has(img)', Common.PatternLinkGenerator('/truyen-hoan-thanh?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLDivElement>('div.name').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyenqo.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation, Tags.Rating.Pornographic);
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
        const imgs = await FetchCSS<HTMLImageElement>(new Request(chapterURL, {
            headers: {
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin'
            }
        }), 'div.content_view_chap > :is(img, svg)');
        return Promise.all(
            imgs.map(async (element) => {
                const link = new URL(await this.PageExtractor(element), chapterURL);
                return new Page(this, chapter, link, { Referer: this.URI.href });
            })
        );
    }

    private async PageExtractor(img: HTMLImageElement | HTMLCanvasElement): Promise<string> {
        const secret = 'dualeo_url_v5_M4nP_2026_Z7cL';

        if (img instanceof HTMLImageElement && !img.dataset.img) return img.src;

        const subImage = img.querySelector('image');
        if (subImage) return subImage.href.toString();

        const uri = new URL(img.dataset.svgImg ?? img.dataset.img);
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

            const name = GetUTF8FromBytes(DecryptXOR(cipher, new Uint8Array(stream)));

            //HMAC
            const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const signature = GetHexFromBytes(new Uint8Array( await crypto.subtle.sign('HMAC', key, GetBytesFromUTF8(`V5|${nonce}|${salt}|${name}`))));

            if (mac == signature)
                uri.pathname = uri.pathname.split('/').toSpliced(-1, 1, `${name}.${extension}`).join('/');

        } catch { }

        return uri.href;
    }
}