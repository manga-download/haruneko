import { Tags } from '../Tags';
import icon from './DigitalMargaret.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('img').getAttribute('alt').trim();
    return {id, title};
}
function ChapterExtractor(element: HTMLElement) {
    const id = element.querySelector('a').pathname;
    const title = element.querySelector('p').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/digitalmargaret\.jp\/detail\/\S+\/$/, 'section#product div.content h3')
@Common.MangasSinglePageCSS('/', 'section#serial ul.serial-list li a', MangaExtractor)
@Common.ChaptersSinglePageCSS('section#product div.list div.box div.number', ChapterExtractor)
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageAjax()

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('digitalmargaret', `デジタルマーガレット (Digital Margaret)`, 'https://digitalmargaret.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

}