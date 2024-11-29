import { Tags } from '../Tags';
import icon from './YoMonga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SBVersion } from './decorators/SpeedBinb';

function MangaExtractor(element: HTMLElement) {
    return {
        id: element.querySelector('a').pathname,
        title: element.querySelector('div.book-box4-title').textContent.trim()
    };
}

function ChapterExtractor(element: HTMLElement) {
    const anchor = element.querySelector<HTMLAnchorElement>('a');
    return {
        id: anchor.pathname + anchor.search,
        title: element.querySelector('span').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/titles\/\d+\//, 'div.intr-title')
@Common.MangasMultiPageCSS('/titles/?page_num={page}', 'div.book-box4', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.episode-list', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax(SBVersion.v016130)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('yomonga', `YoMonga`, 'https://www.yomonga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}