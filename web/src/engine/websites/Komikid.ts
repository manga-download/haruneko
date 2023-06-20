import { Tags } from '../Tags';
import icon from './Komikid.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

@Common.MangaCSS(/^https?:\/\/www\.komikid\.com\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@MangaReader.MangasSinglePageCSS()
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikid', `Komikid`, 'https://www.komikid.com', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}