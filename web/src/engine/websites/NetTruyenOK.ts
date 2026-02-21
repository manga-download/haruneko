import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

@Common.MangaCSS(new RegExp(`^{origin}/manga/[^/]+$`), MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, Common.PatternLinkGenerator('/danh-sach-truyen/{page}'))
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters)
@Common.PagesSinglePageCSS('div.page-chapter > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen#A4F21DC2', 'NetTruyen OK', 'https://nettruyenindex.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}