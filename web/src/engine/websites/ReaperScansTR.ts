import { Tags } from '../Tags';
import icon from './ReaperScansTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@MangaStream.MangaCSS(/^https?:\/\/reaperscans\.com\.tr\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscanstr', `Reaper Scans (Turkish)`, 'https://reaperscans.com.tr', Tags.Language.Turkish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
