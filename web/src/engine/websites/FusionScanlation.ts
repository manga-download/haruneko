import { Tags } from '../Tags';
import icon from './FusionScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/fusionscanlation\.com\/manga\/[^/]+\/$/, 'body meta[property="og:title"]')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fusionscanlation', 'Fusion Scanlation', 'https://fusionscanlation.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}