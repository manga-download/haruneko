// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PatateScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/patatescans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('patatescan', 'Patatescans', 'https://patatescans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PatateScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'patatescan';
        super.label = 'Patatescans';
        this.tags = [ 'webtoon', 'hentai', 'french' ];
        this.url = 'https://patatescans.com';
        this.path = '/manga/list-mode/';
    }
}
*/