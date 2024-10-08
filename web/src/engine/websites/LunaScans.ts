import { Tags } from '../Tags';
import icon from './LunaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lunascans', 'Luna Scans', 'https://tuhafscans.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Turkish );
    }
    public override get Icon() {
        return icon;
    }
}
