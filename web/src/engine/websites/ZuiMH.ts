import { Tags } from '../Tags';
import icon from './ZuiMH.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SinMH from './decorators/SinMH';

@Common.MangaCSS(/^{origin}\/manhua\/[^/]+\/$/, SinMH.queryManga)
@Common.MangasMultiPageCSS(SinMH.path, SinMH.queryMangas)
@SinMH.ChaptersSinglePageJS(SinMH.queryChaptersScript, SinMH.queryChapters)
@SinMH.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zuimh', `最漫画 (ZuiMH)`, 'https://www.zuimh.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}