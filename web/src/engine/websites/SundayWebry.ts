import { Tags } from '../Tags';
import icon from './SundayWebry.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@Common.MangasFromPathsCSS(['/series', '/series/oneshot', '/series/yoru-sunday'], 'ul.webry-series-list > li.webry-series-item > a', undefined, CoreView.DefaultMangaExtractor)
@CoreView.ChaptersMultiPageAJAXV2()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sundaywebry', `サンデーうぇぶり (Sunday Webry)`, 'https://www.sunday-webry.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}