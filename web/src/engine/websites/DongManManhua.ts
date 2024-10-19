import { Tags } from '../Tags';
import icon from './DongManManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as LineW from './decorators/LineWebtoon';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector('p.subj').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/[^/]+\/list\?title_no=\d+$/, LineW.queryMangaTitleURI, Common.ElementLabelExtractor(), true)
@Common.MangasSinglePageCSS('/dailySchedule', 'div.daily_lst ul.daily_card li a.daily_card_item', MangaExtractor)
@LineW.ChaptersMultiPageCSS()
@LineW.PagesSinglePageJS()
@LineW.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('dongmanmanhua', `咚漫 (DongMan Manhua)`, 'https://www.dongmanmanhua.cn', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}