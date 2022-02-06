// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NitroScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nitroscans', `Nitro Scans`, 'https://nitroscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NitroScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'nitroscans';
        super.label = 'Nitro Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://nitroscans.com';
    }
}
*/