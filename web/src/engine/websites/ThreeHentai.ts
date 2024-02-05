import { Tags } from '../Tags';
import icon from './ThreeHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as NHentai from './decorators/NHentai';

@Common.MangaCSS(/^https:\/\/(es\.|fra\.|it\.|pt\.|ru\.)?3hentai\.net\/d\/\d+/, 'div#main-info span.middle-title')
@Common.MangasNotSupported()
@NHentai.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(NHentai.pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('3hentai', `3Hentai`, 'https://3hentai.net', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}