// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './UyuyanBalik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('uyuyanbalik', `Uyuyan Balık`, 'https://uyuyanbalik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class UyuyanBalik extends WordPressMadara {

    constructor() {
        super();
        super.id = 'uyuyanbalik';
        super.label = 'Uyuyan Balık';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://uyuyanbalik.com';
    }
}
*/