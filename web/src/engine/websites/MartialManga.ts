// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MartialManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/martialmanga\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('martialmanga', 'MartialManga', 'https://martialmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MartialManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'martialmanga';
        super.label = 'MartialManga';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://martialmanga.com';
        this.path = '/manga/list-mode/';
    }
}
*/