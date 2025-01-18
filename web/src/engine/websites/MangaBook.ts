import { Tags } from '../Tags';
import icon from './MangaBook.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div#fheader h1')
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'article.short div.sh-desc > a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapters li h5 a')
@Common.PagesSinglePageCSS('div.reader-images div#all img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabook', 'MangaBook', 'https://mangabook.org', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}