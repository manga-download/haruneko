// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsIT.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-it', `Toomics (Itialian)`, 'https://global.toomics.com/it' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsIT extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-it';
        super.label = 'Toomics (Itialian)';
        this.tags = [ 'webtoon', 'italian' ];
        this.url = 'https://global.toomics.com/it'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=it');

        this.path = '/it/webtoon/ranking';
    }
}
*/