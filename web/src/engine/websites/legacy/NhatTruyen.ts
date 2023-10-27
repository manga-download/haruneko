import { Tags } from '../../Tags';
import icon from './NhatTruyen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as Mojo from '../decorators/MojoPortalComic';

@Common.MangaCSS(/^https?:\/\/nhattruyenmin\.com\/truyen-tranh\/[^/]+/, Mojo.queryMangaTitle)
@Common.MangasMultiPageCSS(Mojo.path, Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([/638143969460448990.jpg$/], Mojo.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhattruyen', `NhatTruyen`, 'https://nhattruyenmin.com', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}