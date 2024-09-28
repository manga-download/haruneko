import { Tags } from '../Tags';
import icon from './ThunderScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/comics\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/comics/list-mode/')
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a', Common.AnchorInfoExtractor(false, 'span:not([class="chapternum"])'))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thunderscans', 'ThunderScans', 'https://en-thunderscans.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}