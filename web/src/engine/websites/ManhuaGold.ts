import { Tags } from '../Tags';
import icon from './ManhuaGold.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './decorators/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(Liliana.mangaPath, Liliana.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters, Common.AnchorInfoExtractor(true) )
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagold', 'Manhua Gold', 'https://manhuagold.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}