// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SouDongMan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('soudongman', `斗罗大陆 (SouDongMan)`, 'https://www.kanman.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SouDongMan extends MHXK {

    constructor() {
        super();
        super.id = 'soudongman';
        super.label = '斗罗大陆 (SouDongMan)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.kanman.com';

        this.queryMangaTitle = 'div.title-warper h1.title';
        // extracted from: https://resource.mhxk.com/soudongman_pc/static/js/chunk/vendor.23b7d6.js
        this.product = {
            id: 9,
            name: 'soudm',
            platform: 'pc'
        };
    }
}
*/