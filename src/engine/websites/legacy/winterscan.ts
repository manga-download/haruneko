// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './winterscan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('winterscan', `Winter Scan`, 'https://winterscan.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class winterscan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'winterscan';
        super.label = 'Winter Scan';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://winterscan.com.br';
    }
}
*/