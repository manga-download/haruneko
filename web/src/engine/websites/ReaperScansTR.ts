import { Tags } from '../Tags';
import icon from './ReaperScansTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

@Madara.MangaCSS(/^https?:\/\/reaperscanstr\.com\/seri\//)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Madara.PagesSinglePageCSS('div.page-break img[data-src]')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscanstr', `Reaper Scans (Turkish)`, 'https://reaperscanstr.com', Tags.Language.Turkish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}