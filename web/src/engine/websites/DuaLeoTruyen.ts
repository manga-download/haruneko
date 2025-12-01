import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+\.html  $/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.li_truyen', Common.PatternLinkGenerator('/truyen-hoan-thanh.html?page={page}'), 0, Common.AnchorInfoExtractor(false, '.img'))
@Common.ChaptersSinglePageCSS('div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.content_view_chap img')
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