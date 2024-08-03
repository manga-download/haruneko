import { Tags } from '../Tags';
import icon from './kuimh.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';

@Common.MangaCSS(/^{origin}\/book\/[^/]+$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(MH.mangaPath, MH.queryMangas)
@Common.ChaptersSinglePageCSS('div#chapterlistload ul#detail-list-select li:not([style]) a', MH.ChapterExtractor)
@Common.PagesSinglePageCSS(MH.queryPages, MH.PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuimh', `酷爱漫画 (Kuimh)`, 'https://www.kuimh.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}