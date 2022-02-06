// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DecadenceScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('decadencescans', `Decadence`, 'https://reader.decadencescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DecadenceScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'decadencescans';
        super.label = 'Decadence';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://reader.decadencescans.com';
    }
}
*/