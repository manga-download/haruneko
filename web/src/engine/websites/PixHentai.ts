import { Tags } from '../Tags';
import icon from './PixHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.page-header-title')
@Common.MangasMultiPageCSS('/page/{page}/', 'h2.blog-entry-title a')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('figure.gallery-item img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pixhentai', 'PixHentai', 'https://pixhentai.com', Tags.Media.Manga, Tags.Language.English, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}