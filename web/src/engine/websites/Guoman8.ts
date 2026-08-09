import { Tags } from '../Tags';
import icon from './Guoman8.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SinMH from './decorators/SinMH';

@Common.MangaCSS(/^{origin}\/\d+\/$/, SinMH.queryManga)
@Common.MangasMultiPageCSS(SinMH.queryMangas, Common.PatternLinkGenerator('/list/p-{page}'))
@SinMH.ChaptersSinglePageJS(SinMH.queryChaptersScript, 'div.chapter-list ul li a')
@Common.PagesSinglePageJS('cInfo.fs', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('guoman8', `国漫吧 (Guoman8)`, 'https://www.guoman8.cc', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}