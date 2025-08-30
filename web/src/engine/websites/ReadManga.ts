import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';

@Common.MangaCSS(/^{origin}\/[^/]+$/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, Grouple.pageMangaOffset, 0)
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)// TODO: Randomly redirects to Usagi
@Grouple.PagesSinglePageJS()
@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('readmanga', `ReadManga`, 'https://a.zazaza.me', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}