// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './GuFengMH8.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gufengmh8', `古风漫画网 (GuFengMH8)`, 'https://www.gufengmh8.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GuFengMH8 extends SinMH {

    constructor() {
        super();
        super.id = 'gufengmh8';
        super.label = '古风漫画网 (GuFengMH8)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.gufengmh8.com';
    }
}
*/