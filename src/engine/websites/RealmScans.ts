// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './RealmScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/realmscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/?list')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('realmscans', 'RealmScans', 'https://realmscans.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RealmScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'realmscans';
        super.label = 'RealmScans';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://realmscans.com';
        this.path = '/series/?list';
    }
}
*/