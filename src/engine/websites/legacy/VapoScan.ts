// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './VapoScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vaposcan', `Vapo Scan`, 'https://vaposcan.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class VapoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'vaposcan';
        super.label = 'Vapo Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://vaposcan.net';
    }
}
*/