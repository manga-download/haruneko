// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LineWebtoonEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('linewebtoon-de', `Line Webtoon (German)`, 'https://www.webtoons.com/de' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LineWebtoonEN extends LineWebtoon {

    constructor() {
        super();
        super.id = 'linewebtoon-de';
        super.label = 'Line Webtoon (German)';
        this.tags = [ 'webtoon', 'german' ];
        this.url = 'https://www.webtoons.com/de';
    }
}
*/