import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, MojoPortalComic.MangasLinkGenerator, 2500)
@MojoPortalComic.ChaptersSinglePageAJAX(true)
@MangaStream.PagesSinglePageCSS([/nettruyenviet\.webp$/], MojoPortalComic.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyenar', 'NetTruyenAR', 'https://nettruyenar.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/?page=1', this.URI)), '');
    }
}