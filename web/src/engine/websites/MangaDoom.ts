import { Tags } from '../Tags';
import icon from './MangaDoom.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaInn from './decorators/MangaInn';

@Common.MangaCSS(/^{origin}/, MangaInn.queryMangaTitle)
@MangaInn.MangasMultiPageCSS(MangaInn.queryMangas, '/manga-directory/')
@Common.ChaptersSinglePageCSS(MangaInn.queryChapters, MangaInn.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaInn.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadoom', `MangaDoom`, 'https://www.mngdoom.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
