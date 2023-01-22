// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ZYMKMangaWeb.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zymk', `知音漫客网 (ZYMK MangaWeb)`, 'https://www.zymk.cn' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZYMKMangaWeb extends ZYMK {

    constructor() {
        super();
        super.id = 'zymk';
        super.label = '知音漫客网 (ZYMK MangaWeb)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.zymk.cn';

        this.path = '/sort/index_p';
        this.queryMangasPageCount = 'div.pages a:nth-last-of-type(2)';
    }
}
*/