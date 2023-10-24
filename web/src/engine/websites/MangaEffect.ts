import { Tags } from '../Tags';
import icon from './MangaEffect.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangaeffect\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript, 2000)
@Common.ImageAjax(false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeffect', 'MangaEffect', 'https://mangaeffect.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}