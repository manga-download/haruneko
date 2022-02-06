// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './IsekaiScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('isekaiscan', `IsekaiScan`, 'https://isekaiscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IsekaiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'isekaiscan';
        super.label = 'IsekaiScan';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://isekaiscan.com';
    }
}
*/