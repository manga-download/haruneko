import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const primaryDomain = 'nettruyenviet.com';
const patternAliasDomains = [
    primaryDomain,
    'nettruyenww.com',
].join('|').replaceAll('.', '\\.');

@Common.MangaCSS(new RegExp(`^https?://(${patternAliasDomains})/truyen-tranh/[^/]+$`), MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.patternMangas, MojoPortalComic.queryMangas, 1, 1, 2500)
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters)
@Common.PagesSinglePageCSS(MojoPortalComic.queryPages, (img: HTMLImageElement) => img.dataset.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen#BFBB5C98', 'NetTruyen Viet/WW', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/?page=1', this.URI)), '');
    }
}