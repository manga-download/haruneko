// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LezhinKO.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lezhin-ko', `Lezhin (korean)`, 'https://www.lezhin.com/ko' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LezhinKO extends Lezhin {

    constructor() {
        super();
        super.id = 'lezhin-ko';
        super.label = 'Lezhin (korean)';
        this.tags = [ 'webtoon', 'korean' ];
        this.url = 'https://www.lezhin.com/ko';
        this.links = {
            login: this.url + '/login#email'
        };
        this.requestOptions.headers.set( 'x-cookie', 'x-lz-locale=ko_KR' );
        this.requestOptions.headers.set( 'x-lz-locale', 'ko_KR' );
        this.locale = 'ko-KR';
    }
}
*/