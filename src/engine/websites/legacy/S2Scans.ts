// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './S2Scans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('s2scans', `S2Scans`, 'https://reader.s2smanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class S2Scans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 's2scans';
        super.label = 'S2Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://reader.s2smanga.com';
        //this.path        = '/directory/';
        this.language = 'english';
    }
}
*/