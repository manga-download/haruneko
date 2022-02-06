// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OffScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('offscan', `OFF SCAN`, 'https://offscan.top' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OffScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'offscan';
        super.label = 'OFF SCAN';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://offscan.top';
    }
}
*/