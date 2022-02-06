// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KoMBatch.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kombatch', `KoMBatch`, 'https://kombatch.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KoMBatch extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kombatch';
        super.label = 'KoMBatch';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://kombatch.com';
        this.path = '/manga/list-mode/';
    }

}
*/