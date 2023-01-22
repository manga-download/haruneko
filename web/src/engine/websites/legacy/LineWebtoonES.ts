// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-es', `Line Webtoon (Spanish)`, 'https://www.webtoons.com/es' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonES extends LineWebtoon {

    constructor() {
        super();
        super.id = 'linewebtoon-es';
        super.label = 'Line Webtoon (Spanish)';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://www.webtoons.com/es';
    }
}
*/