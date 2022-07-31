import { Tags } from '../Tags';
import icon from './AresManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/aresmanga\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aresmanga', 'Ares Manga', 'https://aresmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}