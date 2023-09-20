import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sinensisscans\.com\/inicio1\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sinensisscan', 'Sinensis Scans', 'https://sinensisscans.com', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}