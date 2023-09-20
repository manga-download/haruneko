import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/asuracomics\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS([ /ENDING-PAGE/i ], 'div#readerarea p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuracomics.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }
    public override get Icon() {
        return icon;
    }
}