import { Tags } from '../Tags';
import icon from './ComicPash.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Comici from './decorators/ComiciViewer';

const mangaType = [ '連載', '読み切り', '完結'];
const jpDays = ['月', '火', '水', '木', '金', '土', '日'];
const mangaPaths = mangaType.map(t => jpDays.map(day => `/category/manga?type=${encodeURI(t)}&day=${encodeURI(day)}`)).flat();

@Common.MangaCSS(/^{origin}\/series\/[^/]+(\/)?$/, Comici.queryMangaTitleURI)
@Common.MangasSinglePagesCSS(mangaPaths, 'div.series-main-info a')
@Comici.ChaptersSinglePageCSS()
@Comici.PagesSinglePageAJAX()
@Comici.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicpash', `Comic Pash`, 'https://comicpash.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}