// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsJP.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-jp', `Toomics (Japanese)`, 'https://global.toomics.com/jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsJP extends Toomics {

    constructor() {
        super();
        super.id = 'toomics-jp';
        super.label = 'Toomics (Japanese)';
        this.tags = [ 'webtoon', 'japanese' ];
        this.url = 'https://global.toomics.com/jp'; // URL for copy/paste detection
        this.requestOptions.headers.set('x-cookie', 'content_lang=jp');

        this.path = '/jp/webtoon/ranking';
    }
}
*/