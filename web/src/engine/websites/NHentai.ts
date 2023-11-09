import { Tags } from '../Tags';
import icon from './NHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as NHentai from './decorators/NHentai';

@Common.MangaCSS(/https?:\/\/nhentai\.net\/g\/\d+/, NHentai.queryMangaTitle)
@Common.MangasNotSupported()
@NHentai.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(NHentai.pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhentai', `NHentai`, 'https://nhentai.net', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}