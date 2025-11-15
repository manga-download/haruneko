// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LezhinJA.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lezhin-ja', `Lezhin (japanese)`, 'https://lezhin.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LezhinJA extends Lezhin {

    constructor() {
        super();
        super.id = 'lezhin-ja';
        super.label = 'Lezhin (japanese)';
        this.tags = [ 'webtoon', 'japanese' ];
        this.url = 'https://www.lezhin.jp/ja';
        this.links = {
            login: this.url + '/login#email'
        };
        this.requestOptions.headers.set( 'x-cookie', 'x-lz-locale=ja_JP' );
        this.requestOptions.headers.set( 'x-lz-locale', 'ja_JP' );
        this.locale = 'ja-JP';
    }
}
*/