import { Tags } from '../Tags';
import icon from './Usagi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';

@Common.MangaCSS(/^{origin}/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, 50, 0)
@Common.ChaptersSinglePageJS(ReadM.chapterScript, 500)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('usagi', 'Usagi', 'https://web.usagi.one', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}