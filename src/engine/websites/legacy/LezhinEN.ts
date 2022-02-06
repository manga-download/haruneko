// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LezhinEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lezhin-en', `Lezhin (english)`, 'https://www.lezhinus.com/en' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LezhinEN extends Lezhin {

    constructor() {
        super();
        super.id = 'lezhin-en';
        super.label = 'Lezhin (english)';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.lezhinus.com/en';
        this.links = {
            login: this.url + '/login#email'
        };
        this.requestOptions.headers.set( 'x-cookie', 'x-lz-locale=en_US' );
        this.requestOptions.headers.set( 'x-lz-locale', 'en_US' );
        this.locale = 'en-US';
    }
}
*/