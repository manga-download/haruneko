import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga-list.html?page={page}', FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('weloma', `WeLoMa`, 'https://weloma.art', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}