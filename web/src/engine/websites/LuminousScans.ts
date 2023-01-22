// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './LuminousScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.luminousscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('luminousscans', 'Luminous Scans', 'https://www.luminousscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LuminousScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'luminousscans';
        super.label = 'Luminous Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.luminousscans.com';
        this.path = '/series/list-mode/';

        this.queryChapters = 'div#chapterlist ul li a';
    }
}
*/