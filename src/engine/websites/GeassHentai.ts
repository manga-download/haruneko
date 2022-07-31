// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GeassHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/geassscan\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('geasshentai', 'Geass Hentai', 'https://geassscan.xyz/', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GeassHentai extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'geasshentai';
        super.label = 'Geass Hentai';
        this.tags = [ 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://geassscan.xyz/';
        this.path = '/manga/list-mode/';
    }
}
*/