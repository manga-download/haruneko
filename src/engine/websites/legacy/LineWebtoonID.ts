// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonID.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-id', `Line Webtoon (Indonesian)`, 'https://www.webtoons.com/id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonID extends LineWebtoon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'linewebtoon-id';
        super.label = 'Line Webtoon (Indonesian)';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://www.webtoons.com/id';
    }
}
*/