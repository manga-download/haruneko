import { Tags } from '../Tags';
import icon from './QManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break img.wp-manga-chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('qmanga', 'QManga', 'https://qmanga.art', Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}