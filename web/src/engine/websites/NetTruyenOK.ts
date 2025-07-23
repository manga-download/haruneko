import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

@Common.MangaCSS(new RegExp(`^{origin}/manga/[^/]+$`), MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS('/danh-sach-truyen/{page}', MojoPortalComic.queryMangas)
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters)
@Common.PagesSinglePageCSS('div.page-chapter > img:not([src^="data:image"]):not([src*="imgur.com"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen#A4F21DC2', 'NetTruyen OK', 'https://nettruyen1905.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}