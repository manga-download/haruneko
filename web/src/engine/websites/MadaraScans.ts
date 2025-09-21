import { Tags } from '../Tags';
import icon from './MadaraScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/series/list-mode/')
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a[href]', undefined, Common.AnchorInfoExtractor(false, 'span:not([class="chapternum"])'))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madarascans', 'Madara Scans', 'https://madarascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}