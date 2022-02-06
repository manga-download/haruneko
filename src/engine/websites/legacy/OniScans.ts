// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OniScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('oniscans', `Oniscans`, 'https://www.oniscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OniScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'oniscans';
        super.label = 'Oniscans';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://www.oniscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/