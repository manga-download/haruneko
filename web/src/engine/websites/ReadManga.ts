import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';

@Common.MangaCSS(/^https:\/\/(1|zz|t)\.readmanga\.io\/[^/]+$/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, Grouple.pageMangaOffset, 0)
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)// TODO: Randomly redirects to Usagi
@Grouple.PagesSinglePageJS()
@Grouple.ImageAjaxWithMirrors()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('readmanga', `ReadManga`, 'https://t.readmanga.io', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}