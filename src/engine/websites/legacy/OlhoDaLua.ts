// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './OlhoDaLua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olhodalua', `Olho da Lua`, 'https://olhodalua.xyz' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlhoDaLua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olhodalua';
        super.label = 'Olho da Lua';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://olhodalua.xyz';
    }
}
*/