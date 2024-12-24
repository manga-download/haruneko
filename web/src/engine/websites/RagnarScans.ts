import { Tags } from '../Tags';
import icon from './RagnarScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(Madara.WPMangaProtectorPagesExtractorScript, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ragnarscans', 'Ragnar Scans', 'https://ragnarscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}