// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OtakuSekaiScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('otakusekaiscan', `OtakuSekai Scan`, 'https://otkscanlator.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OtakuSekaiScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'otakusekaiscan';
        super.label = 'OtakuSekai Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://otkscanlator.xyz';
    }
}
*/