// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonFR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-fr', `Line Webtoon (French)`, 'https://www.webtoons.com/fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonFR extends LineWebtoon {

    constructor() {
        super();
        super.id = 'linewebtoon-fr';
        super.label = 'Line Webtoon (French)';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://www.webtoons.com/fr';
    }
}
*/