// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhuaTai.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuatai', `ManhuaTai`, 'https://www.manhuatai.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaTai extends MHXK {

    constructor() {
        super();
        super.id = 'manhuatai';
        super.label = 'ManhuaTai';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.manhuatai.com';

        // extracted from: https://resource.mhxk.com/manhuatai_pc/static/js/chunk/vendor.a06c71.js
        this.product = {
            id: 2,
            name: 'mht',
            platform: 'pc'
        };
    }
}
*/