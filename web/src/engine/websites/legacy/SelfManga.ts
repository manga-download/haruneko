import { Tags } from '../../Tags';
import icon from './SelfManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as ReadM from '../decorators/ReadMangaLive';

//TODO http://selfmanga.ru is not HTTP therefore all fetch fails. Suggestion to replace it with https://selfmanga.live

@Common.MangaCSS(/^https?:\/\/selfmanga\.ru\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, ReadM.pageMangaOffset, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(ReadM.queryChapters)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('selfmanga', `SelfManga`, 'http://selfmanga.ru', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}