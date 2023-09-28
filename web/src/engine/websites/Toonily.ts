import { Tags } from '../Tags';
import icon from './Toonily.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/toonily.com\/webtoon\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageCSS()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonily', 'Toonily', 'https://toonily.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}