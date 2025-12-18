import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise (resolve => {
        resolve( [...document.querySelectorAll('div.content_view_chap img')].map(image => {
            const link = image.dataset.img ??  image.dataset.lazy ?? image.dataset.original ?? image.src;
            return link.startsWith('http') ? link : decode_light(link)
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+\.html$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen > a:has(img)', Common.PatternLinkGenerator('/truyen-hoan-thanh.html?page={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.name').textContent.trim() }))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(pageScript, 1500)
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