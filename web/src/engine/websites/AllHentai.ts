import { Tags } from '../Tags';
import icon from './AllHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';
//import { Text } from '../SettingsManager';
//import { WebsiteResourceKey as R } from '../../i18n/ILocale';

// TODO: add url setting

@Common.MangaCSS(/^{origin}\/[^/]+$/, Grouple.queryMangaTitle)
@Common.MangasMultiPageCSS(Grouple.pathMangas, Grouple.queryMangas, 0, Grouple.pageMangaOffset, 1000, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(Grouple.chapterScript, 500)
@Grouple.PagesSinglePageJS()
@Grouple.ImageAjaxWithMirrors()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('allhentai', `AllHentai`, 'https://20.allhen.online', Tags.Language.Russian, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        //this.Settings.url = new Text('UrlOverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.href);
        //this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }
}