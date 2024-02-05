import { Tags } from '../Tags';
import icon from './PortalYaoi.webp';
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
        super('portalyaoi', 'Portal Yaoi', 'https://portalyaoi.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}