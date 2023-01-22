// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LELScanVF.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscanvf', `LELSCAN-VF`, 'https://www.lelscan-vf.co' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LELScanVF extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'lelscanvf';
        super.label = 'LELSCAN-VF';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://www.lelscan-vf.co';
    }
}
*/