import { Tags } from '../Tags';
import icon from './ComicAction.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series', '/series/oneshot', '/series/manga-action'], 'ul[class*="Common_series_list"] li[class*="SeriesListItem_item"]', 'a', ' [class*="SeriesListItem_title"]' )
@CoreView.ChaptersMultiPageAJAXV1()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicaction', `webアクション (Comic Action)`, 'https://comic-action.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}