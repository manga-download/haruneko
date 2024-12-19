import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

@Common.MangaCSS(new RegExp(`^{origin}/truyen/[^/]+$`), 'div.article h1.title-detail')
@Common.MangasMultiPageCSS(MojoPortalComic.patternMangas, 'div.items div.item div.item-info > a')
@Common.ChaptersSinglePageCSS('ul li div.chapter a.link-default')
@Common.PagesSinglePageCSS('div.page-chapter > img:not([src*="donate"]):not([data-src*="donate"])', (img: HTMLImageElement) => img.src || img.dataset.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen#F941B05A', 'NetTruyen ZZZ', 'https://nettruyenzzz.fun', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}