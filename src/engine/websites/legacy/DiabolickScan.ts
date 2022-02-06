// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DiabolickScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('diabolickscan', `Diabolick Scan`, 'https://diabolickscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DiabolickScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'diabolickscan';
        super.label = 'Diabolick Scan';
        this.tags = [ 'webtoon', 'manga', 'portuguese', 'scanlation' ];
        this.url = 'https://diabolickscan.com';
    }
}
*/