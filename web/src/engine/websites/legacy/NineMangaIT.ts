import { Tags } from '../../Tags';
import icon from './NineMangaIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as TAADD from '../decorators/TAADD';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/it\.ninemanga\.com\/manga\/\S+\.html/, 'div.manga div.ttline h1', TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, TAADD.queryMangas)
@TAADD.ChaptersSinglePageCSS()
@TAADD.PagesMultiPageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ninemanga-it', `NineMangaIT`, 'https://it.ninemanga.com', Tags.Language.Italian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}