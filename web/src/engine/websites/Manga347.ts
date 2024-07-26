import { Tags } from '../Tags';
import icon from './Manga347.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Liliana from './templates/Liliana';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(Liliana.mangaPath, Liliana.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga347', 'Manga 347', 'https://manga347.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}