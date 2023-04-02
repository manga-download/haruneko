// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ManhwaTaro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhwataro\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/komik/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwataro', 'ManhwaTaro', 'https://manhwataro.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaTaro extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwataro';
        super.label = 'ManhwaTaro';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://manhwataro.xyz';
        this.path = '/komik/list-mode/';
    }
}
*/