import { Tags } from '../Tags';
import icon from './Usagi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';

@Common.MangaCSS(/^{origin}/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, 50, 0)
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)
@Grouple.PagesSinglePageJS()
@Grouple.ImageAjaxWithMirrors()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('usagi', 'Usagi', 'https://web.usagi.one', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}