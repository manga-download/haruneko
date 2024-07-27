import { Tags } from '../Tags';
import icon from './ManhuaPlus.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Liliana from './templates/Liliana';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article header h1')
@Common.MangasMultiPageCSS(Liliana.mangaPath, 'section div.text-center a.clamp', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters)
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaplus', 'ManhuaPlus', 'https://manhuaplus.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}