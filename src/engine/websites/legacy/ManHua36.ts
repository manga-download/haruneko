// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHua36.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('36manhua', `36漫画网 (36ManHua)`, 'https://www.36mh.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHua36 extends SinMH {

    constructor() {
        super();
        super.id = '36manhua';
        super.label = '36漫画网 (36ManHua)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.36mh.net';
    }
}
*/