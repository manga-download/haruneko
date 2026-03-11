import { Tags } from '../Tags';
import icon from './Hanman18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('div.story_item div.mg_info div.mg_name > a', Common.PatternLinkGenerator('/list-manga/{page}'))
@Common.ChaptersSinglePageCSS('ul li div.item a.chapter_num')
@Common.PagesSinglePageJS(`slides_p_path.map(atob);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hanman18', 'Hanman18', 'https://hanman18.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}