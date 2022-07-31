// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './lemonjuicescan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/lemonjuicescan\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/list-mode')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lemonjuicescan', 'Lemon Juice Scan', 'https://lemonjuicescan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class lemonjuicescan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'lemonjuicescan';
        super.label = 'Lemon Juice Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://lemonjuicescan.com';
        this.path = '/manga/list-mode';
    }
}
*/