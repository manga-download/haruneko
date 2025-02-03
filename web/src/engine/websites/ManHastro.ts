import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/lermanga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS('imageLinks.map( image => atob(image));')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}