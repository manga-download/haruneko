import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { GetBytesFromURLBase64 } from '../BufferEncoder';

function PageExtractor(img: HTMLImageElement) : string {

    if (!img.dataset.img) return img.src;
    const uri = new URL(img.dataset.img);

    try {
        const key = new TextEncoder().encode('dualeo_salt_2025');
        const [, basename, extension ] = uri.pathname.match(/\/([^./]+)\.(.*)$/);
        const encrypted = Array.from(GetBytesFromURLBase64(basename), (byte: number, index) => byte ^ key[index % key.length]);
        const filename = `${String.fromCharCode(...encrypted)}.${extension}`;
        uri.pathname = uri.pathname.split('/').toSpliced(-1, 1, filename).join('/');
    } finally {
        return uri.href;
    }
}

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen > a:has(img)', Common.PatternLinkGenerator('/truyen-hoan-thanh?page={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.name').textContent.trim() }))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.content_view_chap img', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyenyk.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // Latest Domain: https://www.facebook.com/dualeotruyen2/about
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin;`, 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}