// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GogoManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/gogomanga\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gogomanga', 'Gogomanga', 'https://gogomanga.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GogoManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gogomanga';
        super.label = 'Gogomanga';
        this.tags = ['webtoon', 'english', 'manga'];
        this.url = 'https://gogomanga.org';
        this.path = '/manga/list-mode/';
    }
}
*/