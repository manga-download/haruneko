import { Tags } from '../Tags';
import icon from './TonariNoYoungJump.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/tonarinoyj\.jp\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series', '/series/oneshot', '/series/trial'], 'div.serial-contents ul.series-table-list > li.subpage-table-list-item > a', undefined, 'h4.title')
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tonarinoyoungjump', `となりのヤングジャンプ (Tonari no Young Jump)`, 'https://tonarinoyj.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}