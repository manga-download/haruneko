import { Tags } from '../Tags';
import icon from './DigitalMargaret.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').trim()
    };
}
function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector('a').pathname,
        title: element.querySelector('p').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/detail\/[^/]+\/$/, 'section#product div.content h3')
@Common.MangasSinglePageCSS('/', 'section#serial ul.serial-list li a', MangaExtractor)
@Common.ChaptersSinglePageCSS('section#product div.list div.box div.number', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjaxV016061()
@SpeedBinb.ImageAjax()

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('digitalmargaret', `デジタルマーガレット (Digital Margaret)`, 'https://digitalmargaret.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

}