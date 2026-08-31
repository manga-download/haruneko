import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, Common.PatternLinkGenerator('/trang-chu?page={page}'), 500)
@MojoPortalComic.ChaptersSinglePageAJAX()
@MangaStream.PagesSinglePageCSS([/nettruyenviet[^/]*\.(webp|jpeg|jpg|png|avif|bmp|gif)$/], MojoPortalComic.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyengg', 'NetTruyen GG', 'https://nettruyen.gg', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}