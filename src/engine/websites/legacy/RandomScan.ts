// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RandomScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('randomscan', `Random Scan`, 'https://randomscan.online' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RandomScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'randomscan';
        super.label = 'Random Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://randomscan.online';
    }
}
*/