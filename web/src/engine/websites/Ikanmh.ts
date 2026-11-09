import { Tags } from '../Tags';
import icon from './Ikanmh.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';

@Common.MangaCSS(/^{origin}\/book\/[^/]+$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(MH.queryMangas, MH.MangasLinkGenerator)
@Common.ChaptersSinglePageCSS(MH.queryChapters, undefined, MH.ChapterExtractor, true)
@Common.PagesSinglePageCSS(MH.queryPages, MH.PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikanmh', `Ikanmh`, 'https://ikanmh.cc', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}