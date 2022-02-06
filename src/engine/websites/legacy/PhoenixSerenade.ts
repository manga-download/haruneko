// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PhoenixSerenade.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phoenixserenade', `PhoenixSerenade`, 'https://reader.serenade.moe' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhoenixSerenade extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'phoenixserenade';
        super.label = 'PhoenixSerenade';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://reader.serenade.moe';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/