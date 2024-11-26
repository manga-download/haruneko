import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';

@Common.MangaCSS(/^https:\/\/(1|zz)\.readmanga\.io\/[^/]+$/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, 50, 0)
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)// TODO: Randomly redirects to Usagi
@Grouple.PagesSinglePageJS()
@Grouple.ImageAjaxWithMirrors()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('readmanga', `ReadManga`, 'https://zz.readmanga.io', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}