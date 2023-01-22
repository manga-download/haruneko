// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YayuPw.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yayupw', `Yayu Pw`, 'https://yayu.pw' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YayuPw extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'yayupw';
        super.label = 'Yayu Pw';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://yayu.pw';

        this.language = 'tr';
    }
}
*/