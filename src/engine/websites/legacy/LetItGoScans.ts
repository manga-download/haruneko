// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LetItGoScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('letitgoscans', `LetItGoScans`, 'https://reader.letitgo.scans.today' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LetItGoScans extends ComiCake {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'letitgoscans';
        super.label = 'LetItGoScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://reader.letitgo.scans.today';
    }
}
*/