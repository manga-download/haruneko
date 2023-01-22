// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaKid.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangakid\.site\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga-lists/')
@MangaStream.ChaptersSinglePageCSS('div.cl ul li span.leftoff a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakid', 'MangaKid', 'https://mangakid.site', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKid extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangakid';
        super.label = 'MangaKid';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangakid.site';
        this.path = '/manga-lists/';

        this.queryChapters = 'div.cl ul li span.leftoff a';
        this.queryChaptersTitle = undefined;
    }
}
*/