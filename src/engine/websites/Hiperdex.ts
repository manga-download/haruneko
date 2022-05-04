import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hiperdex.com\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Hiperdex"])')
@Madara.MangasMultiPageCSS(undefined, 1000, '/manga-list/page/{page}/')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Language.English);
    }
}