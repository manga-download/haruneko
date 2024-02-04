import { Tags } from '../Tags';
import icon from './Hanman18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';
import { pageScript } from './MangaEighteenClub';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('/list-manga/{page}', 'div.story_item div.mg_info div.mg_name > a')
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hanman18', 'Hanman18', 'https://hanman18.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}