// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GrazeScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/grazescans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('grazescans', 'GrazeScans', 'https://grazescans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GrazeScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'grazescans';
        super.label = 'GrazeScans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://grazescans.com';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div#chapterlist ul li a';
    }
}
*/