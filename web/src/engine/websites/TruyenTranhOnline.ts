import { Tags } from '../Tags';
import icon from './TruyenTranhOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Mojo from './decorators/MojoPortalComic';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen-[^.]+\.html$/, Mojo.queryMangaTitle)
@Common.MangasMultiPageCSS(Mojo.path, Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([/pro5xyz\.jpg$/, /\/123.jpg$/], 'div.reading-detail img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        // TODO: Is tutientruyen5.xyz the correct new domain?
        super('truyentranhaudioonline', 'Truyện tranh online', 'https://protruyen4.xyz', Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}