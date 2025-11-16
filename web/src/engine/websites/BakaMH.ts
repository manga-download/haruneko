import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './BakaMH.webp';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS('ul li a[data-chapter-url]', (element: HTMLAnchorElement) => ({ id: element.dataset.chapterUrl, title: element.text.trim() }))
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bakamh', 'BakaMH', 'https://bakamh.com', Tags.Media.Manhwa, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}