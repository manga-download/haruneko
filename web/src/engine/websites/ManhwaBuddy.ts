import { Tags } from '../Tags';
import icon from './ManhwaBuddy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+\/$/, 'div.bread-crumb ol li:last-of-type')
@Common.MangasMultiPageCSS('/page/{page}/', 'div.latest-list div.mm-name a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter-list li a', Common.AnchorInfoExtractor(false, 'span.ct-update'))
@Common.PagesSinglePageCSS('div.reading-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwabuddy', 'ManhwaBuddy', 'https://manhwabuddy.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}