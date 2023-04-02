// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './RaikiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/raikiscan\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raikiscan', 'Raiki Scan', 'https://raikiscan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RaikiScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'raikiscan';
        super.label = 'Raiki Scan';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://raikiscan.com';
        this.path = '/manga/list-mode/';
    }
}
*/