import { Tags } from '../Tags';
import icon from './ManhuaPlus.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article header h1')
@Common.MangasMultiPageCSS('section div.text-center a.clamp', Liliana.MangasLinkGenerator, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters)
@Liliana.PagesSinglePageJS()
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaplus', 'ManhuaPlus', 'https://manhuaplus.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}