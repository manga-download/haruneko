// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShinzooScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinzooscans', `Shinzoo Scans`, 'https://shinzooscan.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShinzooScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'shinzooscans';
        super.label = 'Shinzoo Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://shinzooscan.xyz';
    }
}
*/