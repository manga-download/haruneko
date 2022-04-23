// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './AnubisScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anubisscans', `Anubis Scans`, 'https://anubisscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnubisScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anubisscans';
        super.label = 'Anubis Scans';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://anubisscans.com';
    }
}
*/