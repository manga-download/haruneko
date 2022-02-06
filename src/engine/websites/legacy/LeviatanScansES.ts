// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LeviatanScansES.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leviatanscans-es', `LeviatanScans (Spanish)`, 'https://es.leviatanscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeviatanScansES extends WordPressMadara {

    constructor() {
        super();
        super.id = 'leviatanscans-es';
        super.label = 'LeviatanScans (Spanish)';
        this.tags = [ 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://es.leviatanscans.com';
    }
}
*/