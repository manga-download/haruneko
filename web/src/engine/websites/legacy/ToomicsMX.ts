// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsMX.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-mx', `Toomics (Spanish MX)`, 'https://global.toomics.com/mx' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsMX extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-mx';
        super.label = 'Toomics (Spanish MX)';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://global.toomics.com/mx'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=es_mx');

        this.path = '/mx/webtoon/ranking';
    }
}
*/