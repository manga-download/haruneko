import { Tags } from '../Tags';
import icon from './ProTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Mojo from './decorators/MojoPortalComic';

@Common.MangaCSS(/^{origin}\/truyen-[^/]+\.html$/, Mojo.queryMangaTitle)
@Common.MangasMultiPageCSS(Mojo.path, Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([], Mojo.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('protruyen', 'ProTruyen', 'https://protruyen.xyz', Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
