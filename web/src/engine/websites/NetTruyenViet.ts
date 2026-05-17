import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';
import { FetchWindowScript } from '../platform/FetchProvider';

const primaryDomain = 'nettruyenviet10.com';
const patternAliasDomains = [
    primaryDomain,
    'nettruyen.work'
].join('|').replaceAll('.', '\\.');

@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, MojoPortalComic.MangasLinkGenerator, 2500)
@MojoPortalComic.ChaptersSinglePageAJAX()
@MangaStream.PagesSinglePageCSS([/nettruyenviet\.webp$/], MojoPortalComic.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen#BFBB5C98', 'NetTruyen Viet/WW', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^https?://(${patternAliasDomains})/truyen-tranh/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //All mirrors are using Cloudflare => force primary domain only
        return Common.FetchMangaCSS.call(this, provider, url.replace(`://${new URL(url).hostname}`, `://${primaryDomain}`), MojoPortalComic.queryManga);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/?page=1', this.URI)), '');
    }
}