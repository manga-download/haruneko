import { Tags } from '../Tags';
import icon from './NhatTruyen.webp';
import MojoPortalComic, { queryMangaTitle } from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
//import { Text } from '../SettingsManager';
//import { WebsiteResourceKey as R } from '../../i18n/ILocale';

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+/, queryMangaTitle)

export default class extends MojoPortalComic {
    public constructor() {
        super('nhattruyen', `NhatTruyen`, 'https://nhattruyenvn.com', [Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator]);
        this.pagesExcludePatterns = [/638143969460448990.jpg$/];
        //this.Settings.url = new Text('urloverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.origin);
        //this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }
}