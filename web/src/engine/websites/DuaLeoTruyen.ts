import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLDivElement>('div.name').innerText.trim()
    };
}

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^.]+\.html$/, 'div.box_info_right h1')
@Common.MangasMultiPageCSS('div.li_truyen a:first-of-type', Common.PatternLinkGenerator('/truyen-hoan-thanh.html?page={page}'), 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.list-chapters div.chapter-item a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.content_view_chap img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyenks.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
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