// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsTC.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-tc', `Toomics (Traditional Chinese)`, 'https://global.toomics.com/tc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsTC extends Toomics {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'toomics-tc';
        super.label = 'Toomics (Traditional Chinese)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://global.toomics.com/tc'; // URL for copy/paste detection
        this.requestOptions.headers.set( 'x-cookie', 'content_lang=zh_tw' );

        this.path = '/tc/webtoon/ranking';
    }
}
*/