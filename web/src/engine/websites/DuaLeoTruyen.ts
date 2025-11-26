import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLHeadingElement>('.card-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.product-grid div.card-body > a', Common.PatternLinkGenerator('/truyen-tranh-moi?page={page}'), 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.list-chapters div.episode-title a')
@Common.PagesSinglePageCSS('div.chapter-content div.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyencg.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
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