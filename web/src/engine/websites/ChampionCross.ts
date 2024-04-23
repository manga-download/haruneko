import { Tags } from '../Tags';
import icon from './ChampionCross.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Comici from './decorators/ComiciViewer';

@Common.MangaCSS(/^{origin}\/series\/[^/]+(\/)?$/, Comici.queryMangaTitleURI)
@Common.MangasMultiPageCSS(Comici.mangaListPath, 'div.article-text > a', 0, 1, 0, Comici.MangaExtractor)
@Comici.ChaptersSinglePageCSS()
@Comici.PagesSinglePageAJAX()
@Comici.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('championcross', `Champion Cross`, 'https://championcross.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}