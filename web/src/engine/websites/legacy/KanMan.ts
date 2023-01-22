// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KanMan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kanman', `看漫画 (KanMan)`, 'https://www.kanman.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KanMan extends MHXK {

    constructor() {
        super();
        super.id = 'kanman';
        super.label = '看漫画 (KanMan)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.kanman.com';

        this.product = {
            id: 1,
            name: 'kmh',
            platform: 'pc'
        };
    }
}
*/