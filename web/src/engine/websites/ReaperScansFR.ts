import { Tags } from '../Tags';
import icon from './ReaperScansFR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

function PageExtractor(image: HTMLImageElement) {
    return image.getAttribute('src').trim().replace(/^http:/, 'https:');
}

@Madara.MangaCSS(/^{origin}\/serie\/[\w-]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS('div.page-break img', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscansfr', `Reaper Scans (French)`, 'https://reaperscans.fr', Tags.Language.French, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}