// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsPT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-pt', `Toomics (Portuguese)`, 'https://global.toomics.com/por' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsPT extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-pt';
        super.label = 'Toomics (Portuguese)';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://global.toomics.com/por'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=pt_br');

        this.path = '/por/webtoon/ranking';
    }
}
*/