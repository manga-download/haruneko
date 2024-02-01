import { Tags } from '../Tags';
import icon from './MangaRawTop.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Liliana from './decorators/Liliana';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(Liliana.mangaPath, Liliana.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarawtop', 'MangaRawTop', 'https://mangaraw.top', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}