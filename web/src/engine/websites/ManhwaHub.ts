import { Tags } from '../Tags';
import icon from './ManhwaHub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/webtoon\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('div.post-title a', Common.PatternLinkGenerator('?page={page}'))
@Common.ChaptersSinglePageCSS('ul li.wp-manga-chapter > a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwahub', 'ManhwaHub', 'https://manhwahub.net', Tags.Media.Manhwa, Tags.Language.English, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}