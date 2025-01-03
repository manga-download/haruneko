import { Tags } from '../Tags';
import icon from './MangaEighteenClub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('/list-manga/{page}', 'div.story_item div.mg_info div.mg_name > a')
@Common.ChaptersSinglePageCSS('ul li div.item a.chapter_num')
@Common.PagesSinglePageJS(`slides_p_path.map(atob);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18-club', 'Manga18.club', 'https://manga18.club', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}