// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KlanKomik.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klankomik', `KlanKomik`, 'https://klankomik.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KlanKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'klankomik';
        super.label = 'KlanKomik';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://klankomik.com';
        this.path = '/manga/list-mode/';
    }

}
*/