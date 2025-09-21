import { Tags } from '../Tags';
import icon from './TonariNoYoungJump.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS([ '/series', '/series/oneshot', '/series/trial' ], 'div.serial-contents ul.series-table-list > li.subpage-table-list-item > a', CoreView.DefaultMangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tonarinoyoungjump', 'となりのヤングジャンプ (Tonari no Young Jump)', 'https://tonarinoyj.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}