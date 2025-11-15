import { Tags } from '../Tags';
import icon from './LianScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lianscans', 'LIAN', 'https://www.lianscans.com', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}