import { Tags } from '../Tags';
import icon from './ScanFR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';
import * as MangaStream from './decorators/WordPressMangaStream';

@MangaStream.MangaCSS(/^https?:\/\/www\.scan-fr\.org\/manga\//, MangaReader.queryMangaTitle)
@MangaReader.MangasSinglePageCSS()
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanfr', `Scan FR`, 'https://www.scan-fr.org', Tags.Language.French, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}