import { Tags } from '../Tags';
import icon from './TuhaoManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhua\/[^/]+\.html$/, 'div.d-name h1 a')
@Common.MangasMultiPageCSS('div#contents a[data-id', Common.PatternLinkGenerator('/category/list/7/page/{page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div.d-player-list a')
@Common.PagesSinglePageCSS('div#ChapterContent p.chapterpic img', (element) => element.dataset.origin)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tuhaomanhua', 'TuhaoManhua', 'https://www.tuhaomanhua.org', Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
