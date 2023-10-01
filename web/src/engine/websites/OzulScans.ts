import { Tags } from '../Tags';
import icon from './OzulScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/ozulscans\.net\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ozulscans', 'Ozul Scans', 'https://ozulscans.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}