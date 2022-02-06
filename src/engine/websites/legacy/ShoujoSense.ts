// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShoujoSense.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shoujosense', `ShoujoSense`, 'http://reader.shoujosense.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShoujoSense extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'shoujosense';
        super.label = 'ShoujoSense';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://reader.shoujosense.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/