import { Tags } from '../Tags';
import icon from './NhatTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.patternMangas, MojoPortalComic.queryMangas)
@MojoPortalComic.ChaptersSinglePageAJAX()
@Common.PagesSinglePageCSS(MojoPortalComic.queryPages, (img: HTMLImageElement) => img.src || img.dataset.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhattruyen', 'NhatTruyen', 'https://nhattruyenqq.com', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
