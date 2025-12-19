import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromBase64 } from '../BufferEncoder';

function PageExtractor(img: HTMLImageElement) : string {
    const xorKey = [100, 117, 97, 108, 101, 111, 95, 115, 97, 108, 116, 95, 50, 48, 50, 53];
    function Pad(s: string): string { return s + '==='.slice((s.length + 3) % 4); };

    if (!img.dataset.img) return img.src;
    const url = new URL(img.dataset.img);

    try {
        const [, filename, extension ] = url.pathname.match(/\/([^./]+)\.(.*)$/);
        const elements = url.pathname.split('/').slice(0, -1);
        const decoded = new TextDecoder('ISO-8859-1').decode(GetBytesFromBase64(Pad(filename.replace(/-/g, '+').replace(/_/g, '/'))));
        let result = '';
        for (let index = 0; index < decoded.length; index++) {
            result += String.fromCharCode(decoded.charCodeAt(index) ^ xorKey[index % xorKey.length]);
        }
        elements.push(result + '.' + extension);
        url.pathname = elements.join('/');
    } finally {
        return url.href;
    }
}

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+\.html$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen > a:has(img)', Common.PatternLinkGenerator('/truyen-hoan-thanh.html?page={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.name').textContent.trim() }))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.content_view_chap img', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyenjd.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // Latest Domain: https://www.facebook.com/dualeotruyen2
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin;`, 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}