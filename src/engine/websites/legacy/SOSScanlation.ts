// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SOSScanlation.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sosscanlation', `SOSScanlation`, 'https://sosscanlation.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SOSScanlation extends MangaReaderCMS {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'sosscanlation';
        super.label = 'SOSScanlation';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://sosscanlation.com';
    }
}
*/