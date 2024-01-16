import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@MangaReader.MangasSinglePageCSS()
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadenizi', `MangaDenizi`, 'http://www.mangadenizi.net', Tags.Language.Turkish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}