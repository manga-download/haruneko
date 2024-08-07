import { Tags } from '../Tags';
import icon from './RokuHentai.webp';
import { DecoratableMangaScraper} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/\d+$/, 'h3.mdc-drawer__title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('img.site-reader__image')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rokuhentai', 'RokuHentai', 'https://rokuhentai.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}