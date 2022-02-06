// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NekoBreakerScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nekobreakerscan', `NekoBreaker Scan`, 'https://nekobreakerscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NekoBreakerScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nekobreakerscan';
        super.label = 'NekoBreaker Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://nekobreakerscan.com';
    }
}
*/