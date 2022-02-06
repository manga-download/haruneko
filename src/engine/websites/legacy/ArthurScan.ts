// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ArthurScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arthurscan', `Arthur Scan`, 'https://arthurscan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ArthurScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'arthurscan';
        super.label = 'Arthur Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://arthurscan.xyz';
    }
}
*/