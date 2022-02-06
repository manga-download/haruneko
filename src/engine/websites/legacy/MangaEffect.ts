// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaEffect.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeffect', `MangaEffect`, 'https://mangaeffect.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEffect extends WordPressMadara {
    constructor() {
        super();
        super.id = 'mangaeffect';
        super.label = 'MangaEffect';
        this.tags = [ 'manga', 'scanlation', 'english' ];
        this.url = 'https://mangaeffect.com';
    }
}
*/