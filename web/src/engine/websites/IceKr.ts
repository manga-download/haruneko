import { Tags } from '../Tags';
import icon from './IceKr.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SinMH from './decorators/SinMH';

@Common.MangaCSS(/^https?:\/\/www\.icekr\.com\/manhua\/[^/]+\/$/, SinMH.queryManga)
@Common.MangasMultiPageCSS(SinMH.path, SinMH.queryMangas)
@SinMH.ChaptersSinglePageJS(SinMH.queryChaptersScript, SinMH.queryChapters)
@SinMH.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('icekr', `冰氪漫画 (iceKr)`, 'https://www.icekr.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //main page is damn slow
    }
}