// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './HakaiScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/hakaiscan\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hakaiscan', 'Hakai Scan', 'http://hakaiscan.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HakaiScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'hakaiscan';
        super.label = 'Hakai Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'http://hakaiscan.xyz';
        this.path = '/manga/list-mode/';
    }
}
*/