// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FRScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('frscan', `Frscan`, 'https://www.frscan.cc' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FRScan extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'frscan';
        super.label = 'Frscan';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://www.frscan.cc';

        this.language = 'fr';
    }
}
*/