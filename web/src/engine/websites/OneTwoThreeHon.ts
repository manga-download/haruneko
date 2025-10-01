import { Tags } from '../Tags';
import icon from './OneTwoThreeHon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.pathname.match(/[^/]+\/web-comic\/([^/]+)\//)[1]
    };
}
function ChapterExtractor(element: HTMLLIElement) {
    return {
        id: new URL(element.querySelector<HTMLAnchorElement>('a').pathname.replace(/index.html$/, ''), this.URI).pathname,
        title: element.innerText.match(/\s*(.*?)\s+/).at(1)
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/web-comic\/[^/]+\/$/, 'div.title-area h2')
@Common.MangasMultiPageCSS('ul.comic__list > li > a', Common.StaticLinkGenerator('/polca/web-comic/', '/nova/web-comic/'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.read-episode li:has(a)', undefined, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onetwothreehon', `123hon`, 'https://www.123hon.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //do nothing, as https://www.123hon.com fails to load but https://www.123hon.com/nova and https://www.123hon.com/polca works
    }
}