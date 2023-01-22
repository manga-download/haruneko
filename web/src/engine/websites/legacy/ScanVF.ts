// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ScanVF.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanvf', `Scan VF`, 'https://www.scan-vf.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScanVF extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'scanvf';
        super.label = 'Scan VF';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://www.scan-vf.net';
    }
}
*/