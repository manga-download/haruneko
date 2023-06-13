import { Tags } from '../Tags';
import icon from './LeviatanScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/en\.leviatanscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leviatanscans', 'LeviatanScans', 'https://en.leviatanscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}