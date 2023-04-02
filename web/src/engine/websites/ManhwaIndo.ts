// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ManhwaIndo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhwaindo\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaindo', 'ManhwaIndo', 'https://manhwaindo.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaIndo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwaindo';
        super.label = 'ManhwaIndo';
        this.tags = ['webtoon', 'indonesian'];
        this.url = 'https://manhwaindo.com';
        this.path = '/series/list-mode/';
    }
}
*/