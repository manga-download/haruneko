// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MasterKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('masterkomik', `MasterKomik`, 'https://masterkomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MasterKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'masterkomik';
        super.label = 'MasterKomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://masterkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/