// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './JiangzaiToon.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jiangzaitoon', `Jiangzaitoon`, 'https://jiangzaitoon.biz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class JiangzaiToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'jiangzaitoon';
        super.label = 'Jiangzaitoon';
        this.tags = [ 'webtoon', 'hentai', 'turkish' ];
        this.url = 'https://jiangzaitoon.biz';
    }
}
*/