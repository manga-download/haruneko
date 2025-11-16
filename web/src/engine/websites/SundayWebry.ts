import { Tags } from '../Tags';
import icon from './SundayWebry.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('ul.webry-series-list > li.webry-series-item > a', Common.StaticLinkGenerator('/series', '/series/oneshot', '/series/yoru-sunday'), 0, CoreView.DefaultMangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sundaywebry', 'サンデーうぇぶり (Sunday Webry)', 'https://www.sunday-webry.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}