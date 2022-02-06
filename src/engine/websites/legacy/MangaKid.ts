// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKid.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakid', `MangaKid`, 'https://mangakid.site' /*, Tags.Language.English, Tags ... */);
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