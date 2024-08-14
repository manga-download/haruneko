import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

// TODO: Add novel support

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sinensisscan', 'Sinensis Scans', 'https://sinensisscan.net', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}