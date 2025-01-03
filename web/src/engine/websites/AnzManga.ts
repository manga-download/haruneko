import { Tags } from '../Tags';
import icon from './AnzManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaReader from './decorators/MangaReaderCMS';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryManga)
@Common.MangasSinglePagesCSS([ MangaReader.patternMangas ], MangaReader.queryMangas)
@Common.ChaptersSinglePageCSS('ul.chapters li a')
@Common.PagesSinglePageCSS('div#all img.img-responsive')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anzmanga', 'AnzManga', 'https://www.anzmangashd.com', Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}