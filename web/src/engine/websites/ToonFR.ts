import { Tags } from '../Tags';
import icon from './ToonFR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.text.split('-').slice(0, -1).join('-').trim(),
    };
}

@Madara.MangaCSS(/^{origin}\/webtoon\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2(undefined, ChapterInfoExtractor)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonfr', 'ToonFR', 'https://toonfr.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}