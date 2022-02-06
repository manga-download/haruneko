// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsFR.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-fr', `Toomics (French)`, 'https://global.toomics.com/fr' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsFR extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-fr';
        super.label = 'Toomics (French)';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://global.toomics.com/fr'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=fr');

        this.path = '/fr/webtoon/ranking';
    }
}
*/