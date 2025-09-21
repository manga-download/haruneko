import { Tags } from '../Tags';
import icon from './EightMuses.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const extractor = Common.AnchorInfoExtractor(true);
function ImageExtractor(element: HTMLImageElement): string {
    return element.dataset.src.replace('/th/', '/fl/');
}
@Common.MangaCSS(/^{origin}\/comics\/album\/[^/]+\/[^/]+$/, 'div#content meta[itemprop="name"]')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('div#content div.gallery a.c-tile', undefined, extractor)
@Common.PagesSinglePageCSS('div.gallery div.image img', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('8muses', `8 MUSES`, 'https://comics.8muses.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}