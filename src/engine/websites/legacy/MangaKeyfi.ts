// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaKeyfi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakeyfi', `Manga Keyfi`, 'https://mangakeyfi.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaKeyfi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangakeyfi';
        super.label = 'Manga Keyfi';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://mangakeyfi.net';
    }
}
*/