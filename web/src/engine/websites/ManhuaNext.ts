import { Tags } from '../Tags';
import icon from './ManhuaNext.webp';
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
        super('manhuanext', 'ManhuaNext', 'https://manhuanext.com', Tags.Media.Manhua, Tags.Source.Aggregator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}