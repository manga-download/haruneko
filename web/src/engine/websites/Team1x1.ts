import { Tags } from '../Tags';
import icon from './Team1x1.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.author-info-title h1')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.bs div.bsx a', Common.PatternLinkGenerator('/series?page={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('.tt').textContent.trim() }))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-card a.chapter-link', Common.PatternLinkGenerator('{id}?page={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('div.chapter-number').textContent.trim() }))
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
}