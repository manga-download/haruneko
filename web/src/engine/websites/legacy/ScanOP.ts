// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScanOP.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanop', `Scan OP`, 'https://scan-op.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScanOP extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'scanop';
        super.label = 'Scan OP';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://scan-op.cc';
    }
}
*/