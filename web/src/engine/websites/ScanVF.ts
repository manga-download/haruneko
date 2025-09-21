import { Tags } from '../Tags';
import icon from './ScanVF.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaReader from './templates/MangaReaderCMS';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, MangaReader.queryManga)
@Common.MangasSinglePageCSS(MangaReader.patternMangas, MangaReader.queryMangas)
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, undefined, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanvf', 'Scan VF', 'https://www.scan-vf.net', Tags.Language.French, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}