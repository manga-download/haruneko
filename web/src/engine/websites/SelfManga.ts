import { Tags } from '../Tags';
import icon from './SelfManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';

@Common.MangaCSS(/^{origin}\/[^/]+$/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, Grouple.pageMangaOffset, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)
@Grouple.PagesSinglePageJS()
@Grouple.ImageAjaxWithMirrors()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('selfmanga', `SelfManga`, 'https://selfmanga.live', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}