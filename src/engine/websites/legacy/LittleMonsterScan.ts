// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LittleMonsterScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('littlemonsterscan', `Little Monster Scan`, 'https://littlemonsterscan.com.br' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LittleMonsterScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'littlemonsterscan';
        super.label = 'Little Monster Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://littlemonsterscan.com.br';
    }
}
*/