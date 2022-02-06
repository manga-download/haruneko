// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikCast.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikcast', `KomikCast`, 'https://komikcast.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikCast extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikcast';
        super.label = 'KomikCast';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikcast.com';
        this.path = '/daftar-komik/?list';

        this.queryMangas = 'div.text-mode_list-items ul li a.series, div.text-mode_list-items ul li a.text-mode_list-item';
        this.queryChapters = 'div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.main-reading-area img[src^="http"], div.separator img[src^="http"]';
    }
}
*/