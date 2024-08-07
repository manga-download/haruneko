import { Tags } from '../Tags';
import icon from './Hiperdex.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title')
@Madara.MangasMultiPageCSS(undefined, 1000, '/manga-list/page/{page}/')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.top', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Language.English);
    }
    public override get Icon() {
        return icon;
    }
}
