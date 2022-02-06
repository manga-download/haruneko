// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YaoiScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoiscan', `YaoiScan`, 'https://yaoiscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YaoiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yaoiscan';
        super.label = 'YaoiScan';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://yaoiscan.com';
    }
}
*/