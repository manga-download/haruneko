import { Tags } from '../Tags';
import icon from './DuaLeoTruyen.webp';
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
        super('dualeotruyen', 'DuaLeoTruyen', 'https://dualeotruyenlv.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}