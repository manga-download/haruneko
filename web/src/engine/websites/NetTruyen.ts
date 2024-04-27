import { Tags } from '../Tags';
import icon from './NetTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Mojo from './decorators/MojoPortalComic';
//import { Text } from '../SettingsManager';
//import { WebsiteResourceKey as R } from '../../i18n/ILocale';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, Mojo.queryMangaTitle)
@Common.MangasMultiPageCSS(Mojo.path, Mojo.queryMangas)
@Common.ChaptersSinglePageCSS(Mojo.queryChapter)
@Mojo.PagesSinglePageCSS([], Mojo.queryPages)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nettruyen', `NetTruyen`, 'https://www.nettruyenvv.com', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
        //this.Settings.url = new Text('urloverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.origin);
        //this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }

}