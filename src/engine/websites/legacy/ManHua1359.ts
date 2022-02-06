// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHua1359.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('1359mh', `1359漫画网 (1359 ManhuaWeb)`, 'https://1359mh.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHua1359 extends ZYMK {

    constructor() {
        super();
        super.id = '1359mh';
        super.label = '1359漫画网 (1359 ManhuaWeb)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://1359mh.com';

        this.path = '/sort/';
    }
}
*/