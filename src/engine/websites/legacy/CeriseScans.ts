// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './CeriseScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cerisescans', `Cerise Scans`, 'https://cerisescans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CeriseScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cerisescans';
        super.label = 'Cerise Scans';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://cerisescans.com';
    }
}
*/