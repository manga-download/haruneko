import { Tags } from '../Tags';
import icon from './SelfManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';

@Common.MangaCSS(/^{origin}\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, ReadM.pageMangaOffset, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(ReadM.chapterScript, 500)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('selfmanga', `SelfManga`, 'https://selfmanga.live', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}