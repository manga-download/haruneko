import { Tags } from '../Tags';
import icon from './Team1x1.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.tt').textContent.trim()
    };
}

@Common.MangasMultiPageCSS('/series?page={page}', 'div.bs div.bsx a', 1, 1, 0, MangaExtractor)
    @Common.ChaptersMultiPageCSS('div.eplister ul li a:not([data-bs-toggle])', 1, 1, 0,
        Common.PatternLinkResolver('{id}?page={page}'),
        (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector('.epl-num:nth-of-type(2)').textContent.trim() }))
@Common.PagesSinglePageCSS('.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('team1x1', `Team X`, 'https://olympustaff.com', Tags.Language.Arabic, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
        //this.Settings.url = new Text('urloverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.origin);
        //(this.Settings.url as Text).Subscribe(value => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return await Common.FetchMangaCSS.call(this, provider, url, 'div.author-info-title h1');
    }
}