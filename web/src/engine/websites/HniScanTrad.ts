import { Tags } from '../Tags';
import icon from './HniScanTrad.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FoolSlide from './decorators/FoolSlide';
import * as Common from './decorators/Common';

@FoolSlide.MangaCSS(/^https?:\/\/hni-scantrad\.com\/lel\/series\/[^/]+\/?$/)
@FoolSlide.MangasMultiPageCSS('/lel/directory/{page}/')
@FoolSlide.ChaptersSinglePageCSS()
@FoolSlide.PagesSinglePageREGEX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hniscantrad', `HNI-Scantrad`, 'http://hni-scantrad.com', Tags.Language.French, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}