import { Tags } from '../Tags';
import icon from './MangaZade.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangazade', 'MangaZade', 'https://mangazade.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}