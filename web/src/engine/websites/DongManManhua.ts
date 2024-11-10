import { Tags } from '../Tags';
import icon from './DongManManhua.webp';
import * as Common from './decorators/Common';
import { LineWebtoonBase } from './templates/LineWebtoonBase';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector('p.subj').textContent.trim()
    };
}

@Common.MangasSinglePageCSS('/dailySchedule', 'div.daily_lst ul.daily_card li a.daily_card_item', MangaExtractor)
export default class extends LineWebtoonBase {
    public constructor() {
        super('dongmanmanhua', `咚漫 (DongMan Manhua)`, 'https://www.dongmanmanhua.cn', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
        this.mangaRegexp = /[^/]+\/[^/]+\/list\?title_no=\d+$/;
        this.languageRegexp = undefined;
    }

    public override get Icon() {
        return icon;
    }
}