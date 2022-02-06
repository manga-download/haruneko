// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Kaguyadex.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kaguyadex', `Kaguyadex`, 'https://kaguyadex.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Kaguyadex extends Genkan {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'kaguyadex';
        super.label = 'Kaguyadex';
        this.tags = [ 'manga', 'english', 'high-quality' ];
        this.url = 'https://kaguyadex.com';
    }
}
*/