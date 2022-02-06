// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaPL.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapl', `MangaPL`, 'https://mangapl.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaPL extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangapl';
        super.label = 'MangaPL';
        this.tags = [ 'hentai', 'korean', 'chinese', 'japanese' ];
        this.url = 'https://mangapl.com';
    }
}
*/