// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KaiManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kaimanhua', `凯漫画 (Kai Manhua)`, 'https://www.kaimanhua.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KaiManhua extends MHXK {

    constructor() {
        super();
        super.id = 'kaimanhua';
        super.label = '凯漫画 (Kai Manhua)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.kaimanhua.com';

        // extracted from: https://resource.mhxk.com/kaimanhua_pc/static/js/chunk/vendor.57e026.js
        this.product = {
            id: 14,
            name: 'kaimh',
            platform: 'pc'
        };
    }
}
*/