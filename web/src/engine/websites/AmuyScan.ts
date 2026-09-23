import { Tags } from '../Tags';
import icon from './AmuyScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('amuyscan', 'AmuyScan', 'https://www.apenasmaisumyaoi.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}