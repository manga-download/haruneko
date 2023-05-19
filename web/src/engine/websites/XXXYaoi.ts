import { Tags } from '../Tags';
import icon from './XXXYaoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/xxxyaoi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xxxyaoi', 'XXXYaoi', 'https://xxxyaoi.com', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}