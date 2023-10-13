import { Tags } from '../Tags';
import icon from './HarmonyScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/banana-scan\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('harmonyscan', 'Harmony Scan', 'https://banana-scan.com', Tags.Media.Manga, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}