import { Tags } from '../Tags';
import icon from './OneTwoThreeHon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function ChapterExtractor(element: HTMLLIElement) {
    return {
        id: new URL(element.querySelector<HTMLAnchorElement>('a').pathname.replace(/index.html$/, ''), this.URI).pathname,
        title: element.innerText.match(/\s*(.*?)\s+/).at(1)
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/web-comic\/[^/]+\/$/, 'div.title-area h2')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('ul.comic__list > li > a', Common.StaticLinkGenerator('/polca/web-comic/', '/nova/web-comic/'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.pathname.match(/[^/]+\/web-comic\/([^/]+)\//).at(1) }))
@Common.ChaptersSinglePageCSS<HTMLLIElement>('div.read-episode li:has(a)', undefined, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onetwothreehon', `123hon`, 'https://www.123hon.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}