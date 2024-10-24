import { Tags } from '../Tags';
import icon from './AllHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';
//import { Text } from '../SettingsManager';
//import { WebsiteResourceKey as R } from '../../i18n/ILocale';

//To see pictures we need to be logged
// TODO: Add a login button? Well login works for now anyway, using the button in fluent core UI

@Common.MangaCSS(/^{origin}\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, ReadM.pageMangaOffset, 1000, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(ReadM.queryChapters)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('allhentai', `AllHentai`, 'https://z.ahen.me', Tags.Language.Russian, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        //this.Settings.url = new Text('UrlOverride', R.Plugin_Settings_UrlOverride, R.Plugin_Settings_UrlOverrideInfo, this.URI.href);
        //this.Settings.url.ValueChanged.Subscribe((_, value: string) => this.URI.href = value);
        //this.URI.href = this.Settings.url.Value as string;
    }

    public override get Icon() {
        return icon;
    }
}