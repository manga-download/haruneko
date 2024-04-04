import { Tags } from '../Tags';
import icon from './MangaSect.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Mojo from './decorators/MojoPortalComic';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, Mojo.queryMangaTitle)
@Common.MangasMultiPageCSS('/all-manga/{page}/', Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([], Mojo.queryPages)
@Common.ImageAjax(true)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasect', 'MangaSect', 'https://mangasect.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}