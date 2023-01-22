// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HniScanTrad.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hniscantrad', `HNI-Scantrad`, 'http://hni-scantrad.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HniScanTrad extends FoolSlide {
    constructor() {
        super();
        super.id = 'hniscantrad';
        super.label = 'HNI-Scantrad';
        this.tags = [ 'manga', 'french', 'scanlation' ];
        this.url = 'http://hni-scantrad.com';
        this.path = '/lel/directory/';
    }
}
*/