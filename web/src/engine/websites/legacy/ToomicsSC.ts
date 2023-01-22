// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsSC.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-sc', `Toomics (Simplified Chinese)`, 'https://global.toomics.com/sc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsSC extends Toomics {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'toomics-sc';
        super.label = 'Toomics (Simplified Chinese)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://global.toomics.com/sc'; // URL for copy/paste detection
        this.requestOptions.headers.set( 'x-cookie', 'content_lang=zh_cn' );

        this.path = '/sc/webtoon/ranking';
    }
}
*/