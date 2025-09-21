import { Tags } from '../Tags';
import icon from './Raw18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ul li[itemprop="itemListElement"]:last-of-type a')
@Common.MangasMultiPageCSS('/search/manga?page={page}', 'div.ModuleContent div.items a:not([data-id])', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#nt_listchapter ul li a')
@Common.PagesSinglePageCSS('div.reading-detail img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('haremu18', 'Raw18', 'https://raw18.my', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}