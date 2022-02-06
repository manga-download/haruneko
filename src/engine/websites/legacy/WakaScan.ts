// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WakaScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wakascan', `WAKASCAN`, 'https://wakascan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WakaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'wakascan';
        super.label = 'WAKASCAN';
        this.tags = [ 'manga', 'french' ];
        this.url = 'https://wakascan.com';
    }
}
*/