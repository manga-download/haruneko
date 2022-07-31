// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikIndo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikindo\.co\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga-list/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindo', 'KomikIndo', 'https://komikindo.co', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikIndo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikindo';
        super.label = 'KomikIndo';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikindo.co';
        this.path = '/manga-list/?list';
    }
}
*/