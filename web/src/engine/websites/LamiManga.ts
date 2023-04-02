// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './LamiManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/lami-manga\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lamimanga', 'Lami-Manga', 'https://lami-manga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LamiManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lamimanga';
        super.label = 'Lami-Manga';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://lami-manga.com';
        this.path = '/manga/list-mode/';
    }
}
*/