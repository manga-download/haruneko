// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SheaManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sheamanga\.my\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sheamanga', 'Shea Manga', 'https://sheamanga.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SheaManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sheamanga';
        super.label = 'Shea Manga';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://sheamanga.my.id';
        this.path = '/manga/list-mode/';
    }
}
*/