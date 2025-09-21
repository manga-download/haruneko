import { Tags } from '../Tags';
import icon from './Manhwa18cc.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/webtoon\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('div.manga-item div.data a:not([class])', Common.PatternLinkGenerator('/page/{page}'))
@Common.ChaptersSinglePageCSS('div#chapterlist li a')
@Common.PagesSinglePageCSS('div.read-manga div.read-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18cc', `Manhwa 18 (.cc)`, 'https://manhwa18.cc', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}