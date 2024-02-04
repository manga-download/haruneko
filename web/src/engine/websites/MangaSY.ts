import { Tags } from '../Tags';
import icon from './MangaSY.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript, 2000)
@Common.ImageAjax(false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasy', 'Manga SY', 'https://www.mangasy.com', Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}