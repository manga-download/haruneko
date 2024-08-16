// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TaoManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        // NOTE: Redirects from www.taomanhua.com to www.kanman.com, seems only some 404 pages are still shown on the domain => https://www.taomanhua.com/app/mht-pc.html
        super('taomanhua', `神漫画 (Tao Manhua)`, 'https://www.kanman.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TaoManhua extends MHXK {

    constructor() {
        super();
        super.id = 'taomanhua';
        super.label = '神漫画 (Tao Manhua)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.taomanhua.com';

        // extracted from: https://resource.mhxk.com/shenmanhua_pc/static/js/chunk/vendor.d9c425.js
        this.product = {
            id: 3,
            name: 'smh',
            platform: 'pc'
        };
    }
}
*/