// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GrazeScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('grazescans', `GrazeScans`, 'https://grazescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GrazeScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'grazescans';
        super.label = 'GrazeScans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://grazescans.com';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div#chapterlist ul li a';
    }
}
*/