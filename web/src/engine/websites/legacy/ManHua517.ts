// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHua517.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('517mh', `517漫画网 (517 ManhuaWeb)`, 'http://www.517mh.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHua517 extends ZYMK {

    constructor() {
        super();
        super.id = '517mh';
        super.label = '517漫画网 (517 ManhuaWeb)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'http://www.517mh.net';

        this.path = '/sort/index_';
    }
}
*/