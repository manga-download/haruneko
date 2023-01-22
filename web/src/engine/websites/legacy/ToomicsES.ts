// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-es', `Toomics (Spanish)`, 'https://global.toomics.com/es' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsES extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-es';
        super.label = 'Toomics (Spanish)';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://global.toomics.com/es'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=es_es');

        this.path = '/es/webtoon/ranking';
    }
}
*/