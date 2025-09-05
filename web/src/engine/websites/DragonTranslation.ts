import { Tags } from '../Tags';
import icon from './DragonTranslation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontranslation', 'DragonTranslation', 'https://dragontranslation.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}