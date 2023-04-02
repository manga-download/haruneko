// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './LELManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.lelmanga\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelmanga', 'LELManga', 'https://www.lelmanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LELManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lelmanga';
        super.label = 'LELManga';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://www.lelmanga.com';
        this.path = '/manga/list-mode/';
    }
}
*/