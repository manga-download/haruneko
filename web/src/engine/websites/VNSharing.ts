import { Tags } from '../Tags';
import icon from './VNSharing.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/index\/read\/\d+\/0\//, 'div.banner_info_read p.title')
@Common.MangasMultiPageCSS('li.browse_result_item a.title', Common.PatternLinkGenerator('/index/KhamPha/newest/{page}'))
@Common.ChaptersSinglePageCSS('ul#manga-info-list li.browse_result_item a.title')
@Common.PagesSinglePageCSS('div.read_content img#manga_page')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('vnsharing', `VNSharing`, 'https://truyen.vnsharing.site', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}