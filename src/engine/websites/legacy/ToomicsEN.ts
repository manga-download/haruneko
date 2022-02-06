// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ToomicsEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toomics-en', `Toomics (English)`, 'https://global.toomics.com/en' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToomicsEN extends Toomics {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'toomics-en';
        super.label = 'Toomics (English)';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://global.toomics.com/en'; // URL for copy/paste detection
        this.requestOptions.headers.set( 'x-cookie', 'content_lang=en' );

        this.path = '/en/webtoon/ranking';
    }
}
*/