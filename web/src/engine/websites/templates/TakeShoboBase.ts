//Magazines hosted at takeshobo.jp (using SpeedBinb)
import { DecoratableMangaScraper } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
import * as SpeedBinb from '../decorators/SpeedBinb';
import { SpeedBindVersion } from '../decorators/SpeedBinb';

function MangaExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLParagraphElement>('p.manga_title').textContent.trim()
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLLIElement>('li.episode').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.manga__title li:first-child')
@Common.MangasSinglePagesCSS(['/manga/'], 'div.manga_item', MangaExtractor)
@Common.ChaptersSinglePageCSS('div.read__area div.read__outer a.read__link:not([href*="#"])', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016061)
@SpeedBinb.ImageAjax()
export class TakeShoboBase extends DecoratableMangaScraper { }
