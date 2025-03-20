import { Tags } from '../Tags';
import icon from './NineMangaBR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as TAADD from './decorators/TAADDBase';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html/, 'div.manga div.ttline h1', TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, TAADD.queryMangas)
@TAADD.ChaptersSinglePageCSS()
@TAADD.PagesSinglePageCSS()
@TAADD.ImageAjaxFromHTML()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ninemanga-br', `NineMangaBR`, 'https://br.ninemanga.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}