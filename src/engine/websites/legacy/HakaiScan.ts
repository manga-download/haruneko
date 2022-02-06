// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HakaiScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hakaiscan', `Hakai Scan`, 'http://hakaiscan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HakaiScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'hakaiscan';
        super.label = 'Hakai Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'http://hakaiscan.xyz';
        this.path = '/manga/list-mode/';
    }
}
*/