// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsDE.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-de', `Toomics (German)`, 'https://global.toomics.com/de' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsDE extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-de';
        super.label = 'Toomics (German)';
        this.tags = [ 'webtoon', 'german' ];
        this.url = 'https://global.toomics.com/de'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=de');

        this.path = '/de/webtoon/ranking';
    }
}
*/