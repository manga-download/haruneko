import { Tags } from '../Tags';
import icon from './EightMusesXXX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const extractor = Common.AnchorInfoExtractor(true);
@Common.MangaCSS(/^{origin}\/comics\/[^/]+\/$/, 'div#content meta[itemprop="name"]')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('div#content div.gallery a.c-tile', undefined, extractor)
@Common.PagesSinglePageCSS('div.gallery div.image img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('8musesxxx', '8 MUSES XXX', 'https://8muses.xxx', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}