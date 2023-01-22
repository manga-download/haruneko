// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './KomiScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiscans', `Komi Scans`, 'https://komiscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomiScans extends Genkan {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'komiscans';
        super.label = 'Komi Scans';
        this.tags = [ 'manga', 'english', 'high-quality', 'scanlation' ];
        this.url = 'https://komiscans.com';
    }
}
*/