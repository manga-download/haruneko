// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OzulScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ozulscans', `Ozul Scans`, 'https://ozulscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OzulScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'ozulscans';
        super.label = 'Ozul Scans';
        this.tags = ['webtoon', 'arabic'];
        this.url = 'https://ozulscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/