import { Tags } from '../Tags';
import icon from './Doujins.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+/, 'head title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('img.doujin', img => img.dataset.file)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujins', `Doujins`, 'https://doujins.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}