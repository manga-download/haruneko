import { Tags } from '../Tags';
import icon from './Seven8te.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';

@Common.MangaCSS(/^{origin}\/cartoon\/\d+$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(MH.mangaPath, MH.queryMangas)
@Common.ChaptersSinglePageCSS(MH.queryChapters, MH.ChapterExtractor)
@Common.PagesSinglePageCSS(MH.queryPages, MH.PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('78te', `78te (特漫网)`, 'https://www.17te.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}