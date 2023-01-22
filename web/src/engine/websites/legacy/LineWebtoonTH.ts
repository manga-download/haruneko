// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonTH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-th', `Line Webtoon (Thai)`, 'https://www.webtoons.com/th' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonTH extends LineWebtoon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'linewebtoon-th';
        super.label = 'Line Webtoon (Thai)';
        this.tags = [ 'webtoon', 'thai' ];
        this.url = 'https://www.webtoons.com/th';
    }
}
*/