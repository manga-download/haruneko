// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomikIndo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindo', `KomikIndo`, 'https://komikindo.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikIndo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikindo';
        super.label = 'KomikIndo';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikindo.co';
        this.path = '/manga-list/?list';
    }
}
*/