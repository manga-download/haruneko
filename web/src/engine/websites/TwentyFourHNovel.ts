import { Tags } from '../Tags';
import icon from './TwentyFourHNovel.webp';
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
        super('24hnovel', '24hnovel', 'https://24hnovel.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}