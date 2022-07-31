// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Komikru.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikru\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikru', 'Komikru', 'https://komikru.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Komikru extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikru';
        super.label = 'Komikru';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://komikru.com';
        this.path = '/manga/?list';
    }
}
*/