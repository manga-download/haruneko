// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KireiCake.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kireicake', `KireiCake`, 'https://reader.kireicake.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KireiCake extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'kireicake';
        super.label = 'KireiCake';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://reader.kireicake.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/