// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonZH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-zh', `Line Webtoon (Chinese)`, 'https://www.webtoons.com/zh' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonZH extends LineWebtoon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'linewebtoon-zh'; // zh-hant
        super.label = 'Line Webtoon (Chinese)'; // Chinese Traditional
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.webtoons.com/zh';
    }
}
*/