import { Tags } from '../Tags';
import icon from './AverisFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('averisfansub', 'Averis Fansub', 'https://averisfansub.site', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}