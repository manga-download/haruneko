// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TsubakiNoScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tsubakinoscan', `Tsubaki No Scan`, 'https://tsubakinoscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TsubakiNoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tsubakinoscan';
        super.label = 'Tsubaki No Scan';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://tsubakinoscan.com';
    }
}
*/