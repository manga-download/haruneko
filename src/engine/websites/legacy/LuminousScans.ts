// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LuminousScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('luminousscans', `Luminous Scans`, 'https://www.luminousscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LuminousScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'luminousscans';
        super.label = 'Luminous Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.luminousscans.com';
        this.path = '/series/list-mode/';

        this.queryChapters = 'div#chapterlist ul li a';
    }
}
*/