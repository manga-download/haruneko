// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './EvilFlowers.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('evilflowers', `EvilFlowers`, 'http://reader.evilflowers.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EvilFlowers extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'evilflowers';
        super.label = 'EvilFlowers';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://reader.evilflowers.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/