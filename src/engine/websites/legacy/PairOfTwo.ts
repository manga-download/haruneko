// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PairOfTwo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pairoftwo', `Pair of 2`, 'https://pairof2.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PairOfTwo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pairoftwo';
        super.label = 'Pair of 2';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://pairof2.com';
        this.path = '/manga/list-mode/';
    }
}
*/