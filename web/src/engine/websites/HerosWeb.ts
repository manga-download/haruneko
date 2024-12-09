import { Tags } from '../Tags';
import icon from './HerosWeb.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasSinglePageCSS(['/series/heros', '/series/flat', '/series/wild'], 'section.series-section ul.series-items > li.series-item > a')
@CoreView.ChaptersSinglePageAJAXV1()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('herosweb', `Hero's (ヒーローズ)`, 'https://viewer.heros-web.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}