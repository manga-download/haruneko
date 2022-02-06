// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AnataNoMotokare.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anatanomotokare', `Anata no Motokare`, 'http://motokare.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnataNoMotokare extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'anatanomotokare';
        super.label = 'Anata no Motokare';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://motokare.xyz';
        this.path = '/reader/directory/';
        this.language = 'english';
    }
}
*/