// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MabushiMajo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mabushimajo', `Mabushimajo`, 'http://mabushimajo.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MabushiMajo extends FoolSlide {

    constructor() {
        super();
        super.id = 'mabushimajo';
        super.label = 'Mabushimajo';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'http://mabushimajo.com';
        this.path = '/onlineokuma/directory/';
        this.language = 'turkish';
    }
}
*/