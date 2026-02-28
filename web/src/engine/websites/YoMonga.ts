import { Tags } from '../Tags';
import icon from './YoMonga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/titles\/\d+\//, 'div.intr-title')
@Common.MangasMultiPageCSS('div.book-box4', Common.PatternLinkGenerator('/titles/?page_num={page}'), 0, element => (
    { id: element.querySelector<HTMLAnchorElement>('a').pathname, title: element.querySelector<HTMLDivElement>('div.book-box4-title').textContent.trim() }
))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.episode-list a', undefined, anchor => (
    { id: anchor.pathname + anchor.search, title: anchor.parentNode.querySelector<HTMLSpanElement>('span').textContent.trim() }
))
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016130, true)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('yomonga', `YoMonga`, 'https://www.yomonga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}