import { Tags } from '../Tags';
import icon from './ReadComicsOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaReader from './templates/MangaReaderCMS';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'h2.listmanga-header')
@Common.MangasSinglePagesCSS([ MangaReader.patternMangas ], MangaReader.queryMangas)
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, undefined, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomicsonline', 'Read Comics Online', 'https://readcomicsonline.ru', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}