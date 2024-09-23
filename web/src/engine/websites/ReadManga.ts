import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';

@Common.MangaCSS(/^https:\/\/(1|zz)\.readmanga\.io\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, 50, 0)
@Common.ChaptersSinglePageCSS(ReadM.queryChapters)// TODO: Randomly redirects to Usagi
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('readmanga', `ReadManga`, 'https://1.readmanga.io', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}