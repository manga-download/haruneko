import { Tags } from '../Tags';
import icon from './FenixScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga-fenix\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fenixscan', 'Manga Fenix', 'https://manga-fenix.com', Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}