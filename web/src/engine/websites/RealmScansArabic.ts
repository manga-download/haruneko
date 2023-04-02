// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './RealmScansArabic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/ar\.realmscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('realmscansarabic', 'RealmScans Arabic', 'https://ar.realmscans.com', Tags.Media.Manga, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RealmScansArabic extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'realmscansarabic';
        super.label = 'RealmScans Arabic';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://ar.realmscans.com';
        this.path = '/series/?list';
    }
}
*/