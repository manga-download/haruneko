import { Tags } from '../Tags';
import icon from './MajorScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS('div#readerarea noscript img[src]:not([src=""])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('majorscans', 'Major Scans', 'https://www.majorscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}