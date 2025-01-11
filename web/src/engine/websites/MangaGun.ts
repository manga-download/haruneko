import { Tags } from '../Tags';
import icon from './MangaGun.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageJS()
@FlatManga.PagesSinglePageAJAX('/app/manga/controllers/cont.Showimage.php?cid=')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangagun', 'MangaGun', 'https://mangagun.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}