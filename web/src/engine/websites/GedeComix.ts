import { Tags } from '../Tags';
import icon from './GedeComix.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/porncomic\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gedecomix', 'GedeComix', 'https://gedecomix.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Comic, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}