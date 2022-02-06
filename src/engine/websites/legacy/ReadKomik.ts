// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readkomik', `ReadKomik`, 'https://www.readkomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'readkomik';
        super.label = 'ReadKomik';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.readkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/