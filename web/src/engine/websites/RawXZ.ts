import { Tags } from '../Tags';
import icon from './RawXZ.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/jp-manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@MangaStream.PagesSinglePageCSS([/07c400d9d4ae35c494529\.jpg$/], 'div.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawxz', 'RawXZ', 'https://rawxz.si', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}